import { useState, useEffect } from 'react';
import './BusinessFinder.css';

// Free APIs - No backend needed! All work directly from browser
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

function BusinessFinder() {
  const [town, setTown] = useState('');
  const [country, setCountry] = useState('');
  const [industry, setIndustry] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'no-website', 'down', 'broken-link'

  // Check website status using a CORS proxy or direct check
  const checkWebsiteStatus = async (url) => {
    if (!url) return 'no-website';
    
    // Normalize URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      // Try using a CORS proxy (free service)
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        method: 'GET',
        timeout: 5000
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.contents?.toLowerCase() || '';
        
        // Check for error indicators
        const errorIndicators = ['404', 'not found', 'error', 'page not found', 'site not found'];
        if (errorIndicators.some(indicator => content.includes(indicator))) {
          return 'broken-link';
        }
        return 'active';
      }
      return 'down';
    } catch (err) {
      // If CORS proxy fails, try direct check (may fail due to CORS)
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache'
        });
        return 'active'; // If no error, assume active (can't verify due to CORS)
      } catch (e) {
        return 'down';
      }
    }
  };

  // Search businesses using OpenStreetMap Nominatim (free, no API key)
  const searchBusinessesNominatim = async (town, country, industry) => {
    try {
      const businesses = [];
      
      // Build location string
      const locationParts = [];
      if (town && town.trim()) locationParts.push(town.trim());
      if (country && country.trim()) locationParts.push(country.trim());
      const location = locationParts.join(', ') || town || country;
      
      if (!location) {
        return [];
      }
      
      // Try multiple search queries for better results
      const searchQueries = [];
      
      if (industry && industry.trim()) {
        // Try with industry/business type
        searchQueries.push(`${industry} ${location}`);
        searchQueries.push(`${industry} in ${location}`);
      } else {
        // Try common business types
        const businessTypes = ['shop', 'restaurant', 'store', 'business', 'office', 'service'];
        for (const bt of businessTypes.slice(0, 3)) { // Limit to 3 to avoid too many requests
          searchQueries.push(`${bt} ${location}`);
        }
      }
      
      for (const searchQuery of searchQueries) {
        const params = new URLSearchParams({
          q: searchQuery,
          format: 'json',
          limit: '20',
          addressdetails: '1',
          extratags: '1',
          namedetails: '1'
        });

        try {
          const response = await fetch(`${NOMINATIM_API_URL}?${params}`, {
            headers: {
              'User-Agent': 'BusinessFinder/1.0 (contact@example.com)'
            }
          });

          if (!response.ok) {
            console.warn(`Nominatim API error for "${searchQuery}":`, response.status);
            continue; // Try next query
          }

          const data = await response.json();
          
          if (!data || data.length === 0) {
            continue; // Try next query
          }

          console.log(`📋 Nominatim returned ${data.length} items for "${searchQuery}"`);
          if (data.length > 0) {
            console.log('📋 Sample item structure:', {
              name: data[0].name,
              display_name: data[0].display_name,
              extratags: data[0].extratags,
              class: data[0].class,
              type: data[0].type
            });
          }

          // Process results - be more inclusive
          for (const item of data) {
            // Skip if we already have this business
            const existingId = item.place_id || item.osm_id;
            if (businesses.some(b => b.id === existingId)) {
              continue;
            }

            // Extract name - try multiple methods (in order of reliability)
            let businessName = null;
            
            // 1. Try direct name field (most reliable)
            if (item.name && item.name.trim() && item.name.trim().length > 1) {
              businessName = item.name.trim();
            }
            
            // 2. Try extratags name fields
            if (!businessName && item.extratags) {
              businessName = item.extratags.name || 
                           item.extratags['name:en'] || 
                           item.extratags['name:en:name'] ||
                           item.extratags.brand ||
                           item.extratags['operator'];
            }
            
            // 3. Try namedetails
            if (!businessName && item.namedetails) {
              businessName = item.namedetails.name || 
                           item.namedetails['name:en'];
            }
            
            // 4. Parse display_name intelligently
            if (!businessName && item.display_name) {
              const parts = item.display_name.split(',').map(p => p.trim()).filter(p => p.length > 0);
              
              // Skip common address components
              const addressWords = ['street', 'road', 'avenue', 'lane', 'drive', 'way', 'close', 'crescent', 
                                   'boulevard', 'highway', 'route', 'st', 'rd', 'ave', 'blvd', 'dr'];
              
              // Find first part that doesn't look like an address
              for (const part of parts) {
                const lowerPart = part.toLowerCase();
                const isAddress = addressWords.some(word => lowerPart.includes(word)) || 
                                 /\d/.test(part); // Contains numbers (likely address)
                
                if (!isAddress && part.length > 2) {
                  businessName = part;
                  break;
                }
              }
              
              // If still no good name, use first part (might be business name)
              if (!businessName && parts.length > 0) {
                businessName = parts[0];
              }
            }
            
            // 5. Try to get business type from class/type
            if (!businessName || businessName.length < 2) {
              const businessType = item.class || item.type || item.category;
              if (businessType) {
                // Capitalize first letter
                businessName = businessType.charAt(0).toUpperCase() + businessType.slice(1) + ' Business';
              } else if (item.display_name) {
                // Last resort: use location from display_name
                const parts = item.display_name.split(',');
                const location = parts[parts.length - 2] || parts[parts.length - 1] || 'Location';
                businessName = `Business in ${location}`;
              } else {
                businessName = 'Business';
              }
            }
            
            // Clean up the name
            businessName = businessName.trim();

            // Create business object
            const business = {
              id: existingId || `nom-${Math.random().toString(36).substr(2, 9)}`,
              name: businessName,
              address: item.display_name || '',
              phone: item.extratags?.phone || '',
              website: item.extratags?.website || item.extratags?.url || '',
              status: 'no-website'
            };

            // Mark status based on website presence
            if (business.website && business.website.trim()) {
              business.status = 'active';
            }

            // Add all results - don't filter here
            businesses.push(business);
            console.log('✅ Added business:', {
              name: business.name,
              status: business.status,
              website: business.website || 'none',
              address: business.address.substring(0, 50) + '...'
            });
          }

          // Rate limiting - wait 1 second between requests (Nominatim requirement)
          if (searchQueries.indexOf(searchQuery) < searchQueries.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (err) {
          console.warn(`Error searching "${searchQuery}":`, err);
          continue; // Try next query
        }
      }

      console.log(`Found ${businesses.length} businesses from Nominatim`);
      return businesses;
    } catch (err) {
      console.error('Error in searchBusinessesNominatim:', err);
      throw err;
    }
  };

  // Search using Overpass API (more detailed OpenStreetMap data)
  const searchBusinessesOverpass = async (town, country, industry) => {
    try {
      // Build location string
      const locationParts = [];
      if (town && town.trim()) locationParts.push(town.trim());
      if (country && country.trim()) locationParts.push(country.trim());
      const location = locationParts.join(', ') || town || country;
      
      if (!location) {
        return [];
      }
      
      // First, get coordinates for the location
      const geocodeParams = new URLSearchParams({
        q: location,
        format: 'json',
        limit: '1'
      });

      const geoResponse = await fetch(`${NOMINATIM_API_URL}?${geocodeParams}`, {
        headers: {
          'User-Agent': 'BusinessFinder/1.0'
        }
      });

      if (!geoResponse.ok) return [];

      const geoData = await geoResponse.json();
      if (geoData.length === 0) return [];

      const { lat, lon } = geoData[0];
      const radius = 5000; // 5km radius

      // Overpass query to find businesses
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["shop"~"."](around:${radius},${lat},${lon});
          node["amenity"~"."](around:${radius},${lat},${lon});
          node["office"~"."](around:${radius},${lat},${lon});
          way["shop"~"."](around:${radius},${lat},${lon});
          way["amenity"~"."](around:${radius},${lat},${lon});
          way["office"~"."](around:${radius},${lat},${lon});
        );
        out center meta;
      `;

      const overpassResponse = await fetch(OVERPASS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      });

      if (!overpassResponse.ok) return [];

      const overpassData = await overpassResponse.json();
      const businesses = [];

      for (const element of overpassData.elements || []) {
        const tags = element.tags || {};
        
        // Extract name - try multiple name fields
        let businessName = tags.name || 
                          tags['name:en'] || 
                          tags['name:en:name'] ||
                          tags.brand ||
                          tags.operator ||
                          tags['operator:name'] ||
                          tags['shop'] ||
                          tags['amenity'] ||
                          tags['office'];
        
        // If still no name, try to create one from type
        if (!businessName || businessName.trim().length < 2) {
          const businessType = tags.shop || tags.amenity || tags.office || tags.leisure || 'Business';
          const location = tags['addr:city'] || tags['addr:town'] || tags['addr:suburb'] || town || '';
          if (location) {
            businessName = `${businessType} in ${location}`;
          } else {
            businessName = businessType.charAt(0).toUpperCase() + businessType.slice(1);
          }
        }
        
        const business = {
          id: element.id || Math.random().toString(),
          name: businessName.trim(),
          address: `${tags['addr:street'] || ''} ${tags['addr:housenumber'] || ''}, ${tags['addr:city'] || tags['addr:town'] || town || country}`.trim(),
          phone: tags.phone || tags['contact:phone'] || tags['phone'] || '',
          website: tags.website || tags.url || tags['contact:website'] || '',
          status: 'no-website'
        };

        if (business.website) {
          business.status = await checkWebsiteStatus(business.website);
        }

        businesses.push(business);
      }

      return businesses;
    } catch (err) {
      console.error('Overpass API error:', err);
      return [];
    }
  };

  // Deduplicate businesses - if multiple businesses have the same name and none have websites, show only one
  const deduplicateBusinesses = (businesses) => {
    if (!businesses || businesses.length === 0) {
      return [];
    }

    const nameMap = new Map();
    
    // Group businesses by normalized name (case-insensitive, trimmed)
    for (const business of businesses) {
      // Normalize name - remove extra spaces, lowercase
      const normalizedName = (business.name || '').toLowerCase().trim().replace(/\s+/g, ' ');
      
      // Be very lenient - only skip if name is truly empty
      if (!normalizedName || normalizedName.length < 1) {
        // Keep businesses even with generic names, just don't deduplicate them
        if (!nameMap.has('_generic')) {
          nameMap.set('_generic', []);
        }
        nameMap.get('_generic').push(business);
        continue;
      }
      
      // Only skip if it's exactly "business" or "unknown business" - but still show them
      if (normalizedName === 'business' || normalizedName === 'unknown business' || normalizedName === 'business location') {
        // Still add them, just in a generic group
        if (!nameMap.has('_generic')) {
          nameMap.set('_generic', []);
        }
        nameMap.get('_generic').push(business);
        continue;
      }
      
      if (!nameMap.has(normalizedName)) {
        nameMap.set(normalizedName, []);
      }
      nameMap.get(normalizedName).push(business);
    }
    
    const deduplicated = [];
    
    for (const [name, group] of nameMap.entries()) {
      // For generic names, show all (don't deduplicate)
      if (name === '_generic') {
        deduplicated.push(...group);
        console.log(`Added ${group.length} generic-named businesses`);
        continue;
      }

      // Check if all businesses in this group have no website
      const allNoWebsite = group.every(b => {
        const hasNoWebsite = !b.website || !b.website.trim();
        const statusNoWebsite = b.status === 'no-website';
        return hasNoWebsite && statusNoWebsite;
      });
      
      if (allNoWebsite && group.length > 1) {
        // If all have no website and there are duplicates, show only the first one
        deduplicated.push(group[0]);
        console.log(`Deduplicated: ${group.length} businesses named "${name}" (all have no website, showing only one)`);
      } else {
        // If at least one has a website, or only one exists, show all
        deduplicated.push(...group);
        console.log(`Added ${group.length} businesses named "${name}"`);
      }
    }
    
    console.log(`Deduplication: ${businesses.length} → ${deduplicated.length} businesses`);
    console.log('Deduplicated businesses:', deduplicated.map(b => ({ name: b.name, status: b.status })));
    return deduplicated;
  };

  const handleSearch = async () => {
    if (!town.trim() && !country.trim()) {
      setError('Please enter at least a town or country');
      return;
    }

    setIsSearching(true);
    setResults([]);
    setError('');

    try {
      console.log('Starting search for:', { town, country, industry });
      
      // Try Nominatim first (simpler, faster)
      let businesses = [];
      
      try {
        businesses = await searchBusinessesNominatim(town.trim(), country.trim(), industry.trim());
        console.log('✅ Nominatim results:', businesses.length);
        console.log('✅ Nominatim businesses array:', businesses);
      } catch (nominatimError) {
        console.error('❌ Nominatim search failed:', nominatimError);
        // Continue to try Overpass
      }
      
      // If not enough results, try Overpass API
      if (businesses.length < 10) {
        try {
          const overpassResults = await searchBusinessesOverpass(town.trim(), country.trim(), industry.trim());
          console.log('Overpass results:', overpassResults.length);
          // Merge results, avoiding duplicates
          const existingIds = new Set(businesses.map(b => b.id));
          for (const business of overpassResults) {
            if (!existingIds.has(business.id)) {
              businesses.push(business);
            }
          }
        } catch (overpassError) {
          console.error('Overpass search failed:', overpassError);
          // Continue with what we have
        }
      }

      console.log('📊 Total businesses found:', businesses.length);
      console.log('📊 Raw businesses data:', JSON.stringify(businesses, null, 2));

      if (businesses.length === 0) {
        setError('No businesses found. Try a different location or industry.');
        setResults([]);
        return;
      }

      // Process businesses and ensure proper structure
      let processedBusinesses = [];
      try {
        processedBusinesses = businesses.map((b, index) => {
          // Ensure all required fields exist with fallbacks
          const business = {
            id: b.id || `biz-${index}-${Math.random().toString(36).substr(2, 9)}`,
            name: b.name || b.address?.split(',')[0] || 'Business',
            address: b.address || '',
            phone: b.phone || '',
            website: b.website || '',
            status: 'no-website'
          };

          // If no website, mark as no-website
          if (!business.website || !business.website.trim()) {
            business.status = 'no-website';
          } else {
            // Has website - mark as active (we'll check later if needed)
            business.status = 'active';
          }

          return business;
        });
        console.log('✅ Processed businesses:', processedBusinesses.length);
        console.log('✅ Processed businesses data:', JSON.stringify(processedBusinesses, null, 2));
      } catch (processError) {
        console.error('❌ Error processing businesses:', processError);
        // Fallback: use businesses as-is
        processedBusinesses = businesses;
      }

      // Deduplicate businesses with same name if all have no website
      let deduplicated = [];
      try {
        deduplicated = deduplicateBusinesses(processedBusinesses);
        console.log(`✅ After deduplication: ${deduplicated.length} businesses (from ${processedBusinesses.length})`);
        console.log('✅ Deduplicated businesses:', JSON.stringify(deduplicated.map(b => ({ name: b.name, status: b.status })), null, 2));
      } catch (dedupError) {
        console.error('❌ Error deduplicating:', dedupError);
        // Fallback: use processed businesses as-is
        deduplicated = processedBusinesses;
      }

      // Show ALL businesses - don't filter them out
      console.log('🔄 Setting results state with', deduplicated.length, 'businesses');
      
      // Ensure we always set results, even if empty
      if (deduplicated.length > 0) {
        setResults(deduplicated);
        console.log('✅ Results state set to:', deduplicated.length);
        console.log(`✅✅✅ Successfully set ${deduplicated.length} results to display`);
        setError(''); // Clear any previous errors
      } else {
        // If deduplication removed everything, try using processed businesses directly
        if (processedBusinesses.length > 0) {
          console.warn('⚠️ Deduplication removed all businesses, using processed businesses instead');
          setResults(processedBusinesses);
          setError('');
        } else if (businesses.length > 0) {
          console.warn('⚠️ Processing removed all businesses, using raw businesses instead');
          // Last resort: use raw businesses with minimal processing
          const fallbackBusinesses = businesses.map((b, idx) => ({
            id: b.id || `fallback-${idx}`,
            name: b.name || 'Business',
            address: b.address || '',
            phone: b.phone || '',
            website: b.website || '',
            status: (b.website && b.website.trim()) ? 'active' : 'no-website'
          }));
          setResults(fallbackBusinesses);
          setError('');
        } else {
          setResults([]);
          setError('No businesses found. Try a different location or industry.');
        }
      }
    } catch (error) {
      console.error('Error searching businesses:', error);
      setError(error.message || 'Failed to search businesses. Please check the browser console for details and try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredResults = results.filter(business => {
    if (filter === 'all') {
      // Show all businesses
      return true;
    }
    return business.status === filter;
  });

  // Debug logging
  useEffect(() => {
    console.log('🔍 Results state changed:', results.length);
    console.log('🔍 Current filter:', filter);
    console.log('🔍 Filtered results count:', filteredResults.length);
    if (results.length > 0) {
      console.log('🔍 Sample result:', results[0]);
      console.log('🔍 All results:', results);
    }
    if (filteredResults.length > 0) {
      console.log('🔍 Filtered results:', filteredResults);
    }
  }, [results, filter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'no-website':
        return <span className="status-badge status-no-website">No Website</span>;
      case 'down':
        return <span className="status-badge status-down">Website Down</span>;
      case 'broken-link':
        return <span className="status-badge status-broken">Broken Link</span>;
      default:
        return null;
    }
  };

  return (
    <div className="business-finder">
      <div className="business-finder-header">
        <h2>Business Finder</h2>
        <p>Find businesses in your area that need a website</p>
      </div>

      <div className="business-finder-search">
        <div className="search-input-group">
          <input
            type="text"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            placeholder="Town / City *"
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            required
          />
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country *"
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            required
          />
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Industry (optional, e.g., restaurant, shop)"
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch} 
            className="search-button"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && (
          <div className="error-message" style={{ marginTop: '1rem', color: '#EF4444', padding: '0.75rem', background: '#FEE2E2', borderRadius: '6px' }}>
            {error}
          </div>
        )}
      </div>

      {/* Debug info - always show when results exist */}
      {results.length > 0 && (
        <div style={{ 
          padding: '0.75rem', 
          background: '#EFF6FF', 
          borderRadius: '8px', 
          marginBottom: '1rem', 
          fontSize: '0.875rem',
          border: '1px solid #3B82F6'
        }}>
          <strong>📊 Debug Info:</strong> Results in state: <strong>{results.length}</strong> | 
          Filter: <strong>{filter}</strong> | 
          Filtered: <strong>{filteredResults.length}</strong>
          {filteredResults.length === 0 && results.length > 0 && (
            <div style={{ marginTop: '0.5rem', color: '#DC2626' }}>
              ⚠️ No results match filter "{filter}". Try "All" filter.
            </div>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div className="business-finder-filters">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All ({results.length})
          </button>
          <button 
            className={filter === 'no-website' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('no-website')}
          >
            No Website ({results.filter(r => r.status === 'no-website').length})
          </button>
          <button 
            className={filter === 'down' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('down')}
          >
            Website Down ({results.filter(r => r.status === 'down').length})
          </button>
          <button 
            className={filter === 'broken-link' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('broken-link')}
          >
            Broken Link ({results.filter(r => r.status === 'broken-link').length})
          </button>
        </div>
      )}

      {isSearching && (
        <div className="business-finder-loading">
          <div className="loading-spinner"></div>
          <p>Searching for businesses...</p>
        </div>
      )}

      {!isSearching && results.length === 0 && (town || country) && !error && (
        <div className="business-finder-empty">
          <p>No businesses found. Try a different location or check the browser console for errors.</p>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem' }}>
            Tip: Enter both town/city and country for better results
          </p>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="business-finder-results">
          {filteredResults.length === 0 ? (
            <div className="business-finder-empty">
              <p>No businesses match the current filter "{filter}". Try selecting "All" to see all {results.length} results.</p>
            </div>
          ) : (
            filteredResults.map((business) => (
            <div key={business.id} className="business-card">
              <div className="business-card-header">
                <h3>{business.name}</h3>
                {getStatusBadge(business.status)}
              </div>
              <div className="business-card-body">
                <div className="business-info">
                  <p><strong>Address:</strong> {business.address}</p>
                  {business.phone && <p><strong>Phone:</strong> {business.phone}</p>}
                  {business.website && (
                    <p>
                      <strong>Website:</strong>{' '}
                      <a 
                        href={business.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        {business.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      )}

      {!town && !country && !isSearching && (
        <div className="business-finder-placeholder">
          <div className="placeholder-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Find Businesses in Your Area</h3>
          <p>Enter a town/city and country above to search for businesses that may need a website</p>
        </div>
      )}
    </div>
  );
}

export default BusinessFinder;
