// Storage utility using Supabase
import { supabase } from '../lib/supabase';

// Contact Submissions
export const saveContactSubmission = async (data) => {
  try {
    const { data: submission, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: data.name,
          email: data.email,
          message: data.message
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      // Provide more helpful error messages
      if (error.code === 'PGRST116' || error.message?.includes('not found') || error.message?.includes('NOT_FOUND')) {
        throw new Error('Database table not found. Please ensure the Supabase tables are created. Check the SQL schema file.');
      }
      throw new Error(error.message || 'Failed to save contact submission');
    }
    
    return {
      id: submission.id,
      ...submission,
      timestamp: submission.created_at
    };
  } catch (error) {
    console.error('Error saving contact submission:', error);
    throw error;
  }
};

export const getContactSubmissions = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      message: item.message,
      timestamp: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return [];
  }
};

// Project Configurations
export const saveProjectConfiguration = async (data) => {
  try {
    // Helper function to convert empty strings to null
    const nullIfEmpty = (value) => (value === '' || value === null || value === undefined ? null : value);
    
    const { data: config, error } = await supabase
      .from('project_configurations')
      .insert([
        {
          project_type: nullIfEmpty(data.projectType),
          project_name: nullIfEmpty(data.projectName),
          description: nullIfEmpty(data.description),
          features: Array.isArray(data.features) ? data.features : [],
          target_audience: nullIfEmpty(data.targetAudience),
          timeline: nullIfEmpty(data.timeline),
          platform: Array.isArray(data.platform) ? data.platform : [],
          integrations: nullIfEmpty(data.integrations),
          design_style: nullIfEmpty(data.designStyle),
          color_scheme: nullIfEmpty(data.colorScheme),
          branding: nullIfEmpty(data.branding),
          content_management: data.contentManagement || false,
          user_authentication: data.userAuthentication || false,
          payment_integration: data.paymentIntegration || false,
          analytics: data.analytics || false,
          seo_optimization: data.seoOptimization || false,
          responsive_design: data.responsiveDesign || false,
          contact_name: nullIfEmpty(data.contactName),
          contact_email: nullIfEmpty(data.contactEmail),
          contact_phone: nullIfEmpty(data.contactPhone),
          company_name: nullIfEmpty(data.companyName),
          additional_notes: nullIfEmpty(data.additionalNotes),
          terms_accepted: data.termsAccepted || false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      // Provide more helpful error messages
      if (error.code === 'PGRST116' || error.message?.includes('not found') || error.message?.includes('NOT_FOUND')) {
        throw new Error('Database table not found. Please ensure the Supabase tables are created. Check the SQL schema file.');
      }
      throw new Error(error.message || 'Failed to save project configuration');
    }
    
    return {
      id: config.id,
      projectType: config.project_type,
      projectName: config.project_name,
      description: config.description,
      features: config.features,
      targetAudience: config.target_audience,
      timeline: config.timeline,
      platform: config.platform,
      integrations: config.integrations,
      designStyle: config.design_style,
      colorScheme: config.color_scheme,
      branding: config.branding,
      contentManagement: config.content_management,
      userAuthentication: config.user_authentication,
      paymentIntegration: config.payment_integration,
      analytics: config.analytics,
      seoOptimization: config.seo_optimization,
      responsiveDesign: config.responsive_design,
      contactName: config.contact_name,
      contactEmail: config.contact_email,
      contactPhone: config.contact_phone,
      companyName: config.company_name,
      additionalNotes: config.additional_notes,
      termsAccepted: config.terms_accepted,
      timestamp: config.created_at
    };
  } catch (error) {
    console.error('Error saving project configuration:', error);
    throw error;
  }
};

export const getProjectConfigurations = async () => {
  try {
    const { data, error } = await supabase
      .from('project_configurations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(config => ({
      id: config.id,
      projectType: config.project_type,
      projectName: config.project_name,
      description: config.description,
      features: config.features,
      targetAudience: config.target_audience,
      timeline: config.timeline,
      platform: config.platform,
      integrations: config.integrations,
      designStyle: config.design_style,
      colorScheme: config.color_scheme,
      branding: config.branding,
      contentManagement: config.content_management,
      userAuthentication: config.user_authentication,
      paymentIntegration: config.payment_integration,
      analytics: config.analytics,
      seoOptimization: config.seo_optimization,
      responsiveDesign: config.responsive_design,
      contactName: config.contact_name,
      contactEmail: config.contact_email,
      contactPhone: config.contact_phone,
      companyName: config.company_name,
      additionalNotes: config.additional_notes,
      termsAccepted: config.terms_accepted,
      timestamp: config.created_at
    }));
  } catch (error) {
    console.error('Error fetching project configurations:', error);
    return [];
  }
};

// Page Visits
export const savePageVisit = async (path) => {
  try {
    const { data, error } = await supabase
      .from('page_visits')
      .insert([{ path }])
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      path: data.path,
      timestamp: data.created_at
    };
  } catch (error) {
    console.warn('Failed to save page visit:', error);
    return null;
  }
};

export const getPageVisits = async () => {
  try {
    const { data, error } = await supabase
      .from('page_visits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10000); // Limit to prevent too much data

    if (error) throw error;
    
    return data.map(visit => ({
      id: visit.id,
      path: visit.path,
      timestamp: visit.created_at
    }));
  } catch (error) {
    console.error('Error fetching page visits:', error);
    return [];
  }
};

// Delete single project configuration
export const deleteProjectConfiguration = async (id) => {
  try {
    const { error } = await supabase
      .from('project_configurations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting project configuration:', error);
    throw error;
  }
};

// Delete single contact submission
export const deleteContactSubmission = async (id) => {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    throw error;
  }
};

// Clear All Data (Admin function - requires authentication)
export const clearAllData = async () => {
  try {
    // Delete all data from tables
    const [contactsResult, projectsResult, visitsResult] = await Promise.all([
      supabase.from('contact_submissions').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('project_configurations').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('page_visits').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    ]);

    if (contactsResult.error) throw contactsResult.error;
    if (projectsResult.error) throw projectsResult.error;
    if (visitsResult.error) throw visitsResult.error;

    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

// Promotion Settings
export const savePromotionData = async (data) => {
  try {
    const { data: promotion, error } = await supabase
      .from('promotion_settings')
      .upsert(
        {
          id: '00000000-0000-0000-0000-000000000001',
          enabled: data.enabled,
          message: data.message,
          price: data.price
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) throw error;
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new Event('promotionUpdated'));
    
    return {
      enabled: promotion.enabled,
      message: promotion.message,
      price: promotion.price
    };
  } catch (error) {
    console.error('Error saving promotion data:', error);
    throw error;
  }
};

export const getPromotionData = async () => {
  try {
    const { data, error } = await supabase
      .from('promotion_settings')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .maybeSingle(); // Use maybeSingle() instead of single() to handle missing rows gracefully

    // If error is 404 or PGRST116 (no rows), return default
    if (error) {
      // Check if it's a "not found" error (table doesn't exist or no rows)
      if (error.code === 'PGRST116' || error.message?.includes('not found') || error.message?.includes('NOT_FOUND')) {
        console.warn('Promotion settings not found, using defaults:', error.message);
        return {
          enabled: true,
          message: 'start a business for',
          price: 'R19999'
        };
      }
      // For other errors, log and return default
      console.error('Error fetching promotion data:', error);
      return {
        enabled: true,
        message: 'start a business for',
        price: 'R19999'
      };
    }

    // If no data exists, return default
    if (!data) {
      return {
        enabled: true,
        message: 'start a business for',
        price: 'R19999'
      };
    }
    
    return {
      enabled: data.enabled,
      message: data.message,
      price: data.price
    };
  } catch (error) {
    console.error('Error fetching promotion data:', error);
    // Return default on error
    return {
      enabled: true,
      message: 'start a business for',
      price: 'R19999'
    };
  }
};

