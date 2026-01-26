import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getContactSubmissions,
  getProjectConfigurations,
  getPageVisits,
  clearAllData,
  deleteProjectConfiguration,
  deleteContactSubmission,
  saveQuoteOrInvoice,
  getQuotesAndInvoices,
  deleteQuoteOrInvoice,
  updateQuoteOrInvoiceStatus,
  getCompanySettings,
  saveCompanySettings
} from '../utils/storage';
import './Admin.css';

function Admin() {
  const { isAuthenticated, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Set initial tab based on user role when it's loaded
  useEffect(() => {
    if (userRole === 'telesales1' && activeTab !== 'quotes') {
      setActiveTab('quotes');
    } else if (userRole === 'admin' && activeTab === 'quotes') {
      setActiveTab('overview');
    }
  }, [userRole]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [projectConfigs, setProjectConfigs] = useState([]);
  const [pageVisits, setPageVisits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all'); // 'all', 'website', 'web-app', 'mobile-app', etc.
  const [projectSort, setProjectSort] = useState('newest'); // 'newest', 'oldest', 'name'
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [quotesInvoices, setQuotesInvoices] = useState([]);
  const [showQuoteInvoiceForm, setShowQuoteInvoiceForm] = useState(false);
  const [quoteInvoiceType, setQuoteInvoiceType] = useState('quote'); // 'quote' or 'invoice'
  const [editingQuoteInvoiceId, setEditingQuoteInvoiceId] = useState(null); // Track which quote/invoice is being edited
  const [showPreview, setShowPreview] = useState(false);
  const [companySettings, setCompanySettings] = useState({
    quotePrefix: 'QUO',
    invoicePrefix: 'INV',
    quotePrefixType: 'custom',
    invoicePrefixType: 'custom',
    companyName: 'INVEXB',
    companyEmail: 'info@invexb.com',
    companyPhone: '',
    companyWebsite: '',
    companyAddress: '',
    companyVat: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountType: '',
    bankBranchCode: '',
    bankSwiftCode: ''
  });
  const [quoteInvoiceForm, setQuoteInvoiceForm] = useState({
    documentNumber: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    billingAddress: '',
    companyName: 'INVEXB',
    companyEmail: 'info@invexb.com',
    companyPhone: '',
    companyWebsite: '',
    companyAddress: '',
    companyVat: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    taxRate: '',
    discount: '',
    notes: '',
    terms: 'Payment terms: 50% deposit required to begin work. Balance due upon completion.',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate, userRole]);

  const loadData = async () => {
    try {
      if (userRole === 'telesales1') {
        // Telesales1 only needs quotes/invoices and company settings (read-only for company info)
        const [quotesInvoices, settings] = await Promise.all([
          getQuotesAndInvoices(),
          getCompanySettings()
        ]);
        setQuotesInvoices(quotesInvoices);
        setCompanySettings(settings);
        // Update form with company settings
        setQuoteInvoiceForm(prev => ({
          ...prev,
          companyName: settings.companyName,
          companyEmail: settings.companyEmail,
          companyPhone: settings.companyPhone,
          companyWebsite: settings.companyWebsite,
          companyAddress: settings.companyAddress,
          companyVat: settings.companyVat
        }));
      } else {
        // Admin gets all data
        const [contacts, projects, visits, quotesInvoices, settings] = await Promise.all([
          getContactSubmissions(),
          getProjectConfigurations(),
          getPageVisits(),
          getQuotesAndInvoices(),
          getCompanySettings()
        ]);
        setContactSubmissions(contacts);
        setProjectConfigs(projects);
        setPageVisits(visits);
        setQuotesInvoices(quotesInvoices);
        setCompanySettings(settings);
        // Update form with company settings
        setQuoteInvoiceForm(prev => ({
          ...prev,
          companyName: settings.companyName,
          companyEmail: settings.companyEmail,
          companyPhone: settings.companyPhone,
          companyWebsite: settings.companyWebsite,
          companyAddress: settings.companyAddress,
          companyVat: settings.companyVat
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      try {
        await clearAllData();
        await loadData();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Failed to clear data. Please try again.');
      }
    }
  };

  const getVisitStats = () => {
    const stats = {};
    pageVisits.forEach(visit => {
      stats[visit.path] = (stats[visit.path] || 0) + 1;
    });
    return stats;
  };

  const visitStats = getVisitStats();

  const filteredContacts = contactSubmissions.filter(sub => 
    sub.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project configuration? This cannot be undone.')) {
      try {
        await deleteProjectConfiguration(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact submission? This cannot be undone.')) {
      try {
        await deleteContactSubmission(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact. Please try again.');
      }
    }
  };

  const toggleProjectExpanded = (id) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedProjects(newExpanded);
  };

  // Filter and sort projects
  let filteredProjects = projectConfigs.filter(proj => {
    const matchesSearch = 
      proj.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.contactName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = projectFilter === 'all' || proj.projectType === projectFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Sort projects
  filteredProjects = [...filteredProjects].sort((a, b) => {
    if (projectSort === 'newest') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else if (projectSort === 'oldest') {
      return new Date(a.timestamp) - new Date(b.timestamp);
    } else if (projectSort === 'name') {
      return (a.projectName || '').localeCompare(b.projectName || '');
    }
    return 0;
  });

  // Get unique project types for filter
  const projectTypes = ['all', ...new Set(projectConfigs.map(p => p.projectType).filter(Boolean))];

  // Quote/Invoice handlers
  const generateRandomString = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateDocumentNumber = (type) => {
    const prefixType = type === 'quote' ? companySettings.quotePrefixType : companySettings.invoicePrefixType;
    const customPrefix = type === 'quote' ? companySettings.quotePrefix : companySettings.invoicePrefix;
    
    let prefix;
    if (prefixType === 'random') {
      prefix = generateRandomString(6);
    } else {
      prefix = customPrefix || (type === 'quote' ? 'QUO' : 'INV');
    }
    
    const count = quotesInvoices.filter(doc => doc.type === type).length + 1;
    return `${prefix}-${String(count).padStart(4, '0')}`;
  };

  const calculateTotals = (items, taxRate, discount) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxRateValue = taxRate === '' || taxRate === null ? 0 : parseFloat(taxRate) || 0;
    const discountValue = discount === '' || discount === null ? 0 : parseFloat(discount) || 0;
    const taxAmount = subtotal * (taxRateValue / 100);
    const total = subtotal + taxAmount - discountValue;
    return { subtotal, taxAmount, total, taxRateValue, discountValue };
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...quoteInvoiceForm.items];
    newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setQuoteInvoiceForm({ ...quoteInvoiceForm, items: newItems });
  };

  const addItem = () => {
    setQuoteInvoiceForm({
      ...quoteInvoiceForm,
      items: [...quoteInvoiceForm.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = quoteInvoiceForm.items.filter((_, i) => i !== index);
    setQuoteInvoiceForm({ ...quoteInvoiceForm, items: newItems });
  };

  const handleEditQuoteInvoice = async (doc) => {
    // Reload company settings to ensure we have the latest data
    const settings = await getCompanySettings();
    setCompanySettings(settings);
    
    setEditingQuoteInvoiceId(doc.id);
    setQuoteInvoiceType(doc.type);
    setQuoteInvoiceForm({
      documentNumber: doc.documentNumber,
      clientName: doc.clientName,
      clientEmail: doc.clientEmail,
      clientPhone: doc.clientPhone,
      clientAddress: doc.clientAddress,
      billingAddress: doc.billingAddress || '',
      companyName: doc.companyName || settings.companyName,
      companyEmail: doc.companyEmail || settings.companyEmail,
      companyPhone: doc.companyPhone || settings.companyPhone,
      companyWebsite: doc.companyWebsite || settings.companyWebsite || '',
      companyAddress: doc.companyAddress || settings.companyAddress,
      companyVat: doc.companyVat || settings.companyVat,
      items: doc.items && doc.items.length > 0 ? doc.items : [{ description: '', quantity: 1, price: 0 }],
      taxRate: doc.taxRate || '',
      discount: doc.discount || '',
      notes: doc.notes || '',
      terms: doc.terms || 'Payment terms: 50% deposit required to begin work. Balance due upon completion.',
      issueDate: doc.issueDate,
      dueDate: doc.dueDate,
      status: doc.status
    });
    setShowQuoteInvoiceForm(true);
  };

  const handleSaveQuoteInvoice = async () => {
    try {
      const totals = calculateTotals(quoteInvoiceForm.items, quoteInvoiceForm.taxRate, quoteInvoiceForm.discount);
      const documentNumber = quoteInvoiceForm.documentNumber || generateDocumentNumber(quoteInvoiceType);
      
      await saveQuoteOrInvoice({
        id: editingQuoteInvoiceId, // Include ID if editing
        type: quoteInvoiceType,
        documentNumber,
        ...quoteInvoiceForm,
        taxRate: quoteInvoiceForm.taxRate === '' ? 0 : parseFloat(quoteInvoiceForm.taxRate) || 0,
        discount: quoteInvoiceForm.discount === '' ? 0 : parseFloat(quoteInvoiceForm.discount) || 0,
        ...totals,
        status: quoteInvoiceForm.status || (quoteInvoiceType === 'quote' ? 'pending' : 'unpaid')
      });
      
      await loadData();
      setShowQuoteInvoiceForm(false);
      setEditingQuoteInvoiceId(null);
      setQuoteInvoiceForm({
        documentNumber: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        billingAddress: '',
        companyName: 'INVEXB',
        companyEmail: 'info@invexb.com',
        companyPhone: '',
        companyWebsite: '',
        companyAddress: '',
        companyVat: '',
        items: [{ description: '', quantity: 1, price: 0 }],
        taxRate: '',
        discount: '',
        notes: '',
        terms: 'Payment terms: 50% deposit required to begin work. Balance due upon completion.',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending'
      });
      alert(`${quoteInvoiceType === 'quote' ? 'Quote' : 'Invoice'} ${editingQuoteInvoiceId ? 'updated' : 'saved'} successfully!`);
    } catch (error) {
      console.error('Error saving quote/invoice:', error);
      const errorMessage = error?.message || error?.error_description || 'Unknown error';
      alert(`Failed to save ${quoteInvoiceType}: ${errorMessage}\n\nPlease check the browser console for more details.`);
    }
  };

  const handleDeleteQuoteInvoice = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteQuoteOrInvoice(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting quote/invoice:', error);
        alert('Failed to delete. Please try again.');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateQuoteOrInvoiceStatus(id, newStatus);
      await loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleConvertQuoteToInvoice = async (quote) => {
    if (!window.confirm('Convert this quote to an invoice? A new invoice will be created.')) {
      return;
    }
    
    try {
      const totals = calculateTotals(quote.items, quote.taxRate, quote.discount);
      const invoiceNumber = generateDocumentNumber('invoice');
      
      await saveQuoteOrInvoice({
        type: 'invoice',
        documentNumber: invoiceNumber,
        clientName: quote.clientName,
        clientEmail: quote.clientEmail,
        clientPhone: quote.clientPhone,
        clientAddress: quote.clientAddress,
        billingAddress: quote.billingAddress || '',
        companyName: quote.companyName || companySettings.companyName,
        companyEmail: quote.companyEmail || companySettings.companyEmail,
        companyPhone: quote.companyPhone || companySettings.companyPhone,
        companyWebsite: quote.companyWebsite || companySettings.companyWebsite,
        companyAddress: quote.companyAddress || companySettings.companyAddress,
        companyVat: quote.companyVat || companySettings.companyVat,
        items: quote.items,
        taxRate: quote.taxRate,
        discount: quote.discount,
        notes: quote.notes,
        terms: quote.terms,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: quote.dueDate,
        ...totals,
        status: 'unpaid'
      });
      
      await loadData();
      alert('Quote converted to invoice successfully!');
    } catch (error) {
      console.error('Error converting quote to invoice:', error);
      alert('Failed to convert quote to invoice. Please try again.');
    }
  };

  const calculateValidDays = (issueDate, validUntilDate) => {
    if (!validUntilDate) return null;
    const issue = new Date(issueDate);
    const validUntil = new Date(validUntilDate);
    const diffTime = validUntil - issue;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const generateDocumentHTML = (doc, isPreview = false) => {
    const totals = calculateTotals(doc.items, doc.taxRate, doc.discount);
    // Banking details should always show in documents, but telesales1 cannot edit them
    const bankDetails = companySettings;
    const validDays = calculateValidDays(doc.issueDate, doc.dueDate);
    // Logo path - will work when document is opened from the same origin
    const logoPath = isPreview 
      ? '/invexb-logo.png' 
      : `${window.location.origin}/invexb-logo.png`;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${doc.type === 'quote' ? 'Quote' : 'Invoice'} - ${doc.documentNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { 
              size: A4; 
              margin: 15mm;
            }
            @media print {
              @page {
                size: A4;
                margin: 15mm;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                margin: 0;
                padding: 0;
              }
            }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; padding: 20px; color: #1a1a1a; background: #fff; font-size: 12px; line-height: 1.4; page-break-after: avoid; page-break-inside: avoid; }
            .header { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #E5E7EB; position: relative; }
            .header-content { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
            .logo-section { position: absolute; top: 0; right: 0; text-align: right; }
            .logo-image { height: 50px; width: auto; object-fit: contain; display: block; margin-bottom: 8px; }
            .logo-info { font-size: 11px; color: #6B7280; line-height: 1.5; }
            .logo-info .info-row { display: block; margin-bottom: 3px; }
            .logo-info .info-label { font-weight: 600; color: #374151; margin-right: 5px; }
            .logo-info .info-value { color: #111827; }
            .company-info { flex: 1; max-width: 65%; }
            .company-info h2 { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 6px; letter-spacing: -0.01em; }
            .company-info p { font-size: 11px; color: #6B7280; margin: 2px 0; line-height: 1.4; }
            .document-header { margin-top: 10px; }
            .document-title { font-size: 28px; font-weight: 800; margin-bottom: 4px; color: #111827; letter-spacing: -0.02em; }
            .document-number { font-size: 13px; color: #6B7280; font-weight: 600; }
            .info-section { margin-bottom: 15px; }
            .info-row { margin-bottom: 4px; font-size: 11px; display: inline-block; margin-right: 20px; }
            .info-label { font-weight: 600; color: #374151; margin-right: 5px; }
            .info-value { color: #111827; }
            .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 11px; }
            th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #E5E7EB; }
            th { background-color: #F9FAFB; font-weight: 700; color: #111827; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
            tbody tr:last-child td { border-bottom: 2px solid #E5E7EB; }
            .text-right { text-align: right; }
            .totals { margin-top: 15px; margin-left: auto; width: 280px; padding: 12px; background: #F9FAFB; border-radius: 6px; border: 1px solid #E5E7EB; }
            .totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; }
            .totals-row.total { font-size: 16px; font-weight: 800; border-top: 2px solid #111827; padding-top: 8px; margin-top: 5px; color: #111827; }
            .notes { margin-top: 15px; padding: 12px; background: #F9FAFB; border-radius: 6px; border-left: 3px solid #1452f0; font-size: 11px; }
            .notes strong { color: #111827; font-size: 12px; }
            .notes p { margin-top: 4px; color: #374151; line-height: 1.5; }
            .terms { margin-top: 12px; padding: 12px; background: #F3F4F6; border-radius: 6px; font-size: 10px; border-left: 3px solid #6B7280; }
            .terms strong { color: #111827; font-size: 11px; }
            .terms p { margin-top: 4px; color: #4B5563; line-height: 1.5; }
            .banking-details { margin-top: 15px; padding: 12px; background: #EFF6FF; border-radius: 6px; border-left: 3px solid #1452f0; font-size: 11px; }
            .banking-details h4 { margin-bottom: 6px; color: #1452f0; font-size: 12px; font-weight: 700; }
            .banking-details p { margin: 3px 0; color: #1E40AF; font-size: 11px; line-height: 1.4; }
            .bill-to-section { background: #F9FAFB; padding: 12px; border-radius: 6px; border: 1px solid #E5E7EB; }
            .bill-to-section h3 { font-size: 12px; font-weight: 700; color: #111827; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
            .bill-to-section p { margin: 3px 0; color: #374151; font-size: 11px; line-height: 1.4; }
            .bill-to-section strong { color: #111827; font-size: 12px; }
            .footer-section { margin-top: 15px; padding-top: 12px; border-top: 1px solid #E5E7EB; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 10px; }
            @media print { 
              body { padding: 0; }
              .header { page-break-inside: avoid; margin-bottom: 15px; }
              table { page-break-inside: avoid; }
              .two-column { page-break-inside: avoid; }
              .totals { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-content">
              <div class="company-info">
                <h2>${doc.companyName || companySettings.companyName || 'INVEXB'}</h2>
                ${(doc.companyAddress || companySettings.companyAddress) ? `<p>${doc.companyAddress || companySettings.companyAddress}</p>` : ''}
                ${(doc.companyEmail || companySettings.companyEmail) ? `<p>Email: ${doc.companyEmail || companySettings.companyEmail}</p>` : ''}
                ${(doc.companyPhone || companySettings.companyPhone) ? `<p>Phone: ${doc.companyPhone || companySettings.companyPhone}</p>` : ''}
                ${(doc.companyWebsite || companySettings.companyWebsite) ? `<p>Website: ${doc.companyWebsite || companySettings.companyWebsite}</p>` : ''}
                ${(doc.companyVat || companySettings.companyVat) ? `<p>VAT: ${doc.companyVat || companySettings.companyVat}</p>` : ''}
              </div>
              <div class="logo-section">
                <img src="${logoPath}" alt="InvexB Logo" class="logo-image" onerror="this.style.display='none';" />
                <div class="logo-info">
                  <div class="info-row">
                    <span class="info-label">Issue Date:</span>
                    <span class="info-value">${new Date(doc.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  ${validDays ? `
                    <div class="info-row">
                      <span class="info-label">Valid For:</span>
                      <span class="info-value">${validDays} ${validDays === 1 ? 'day' : 'days'}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
            <div class="document-header">
              <div class="document-title">${doc.type === 'quote' ? 'QUOTE' : 'INVOICE'}</div>
              <div class="document-number">${doc.documentNumber}</div>
            </div>
          </div>
          
          <div class="bill-to-section">
            <h3>Bill To</h3>
            <p><strong>${doc.clientName}</strong></p>
            ${doc.type === 'invoice' && doc.billingAddress ? `<p><strong>Billing Address:</strong><br>${doc.billingAddress}</p>` : ''}
            ${doc.clientAddress ? `<p>${doc.clientAddress}</p>` : ''}
            ${doc.clientEmail ? `<p>Email: ${doc.clientEmail}</p>` : ''}
            ${doc.clientPhone ? `<p>Phone: ${doc.clientPhone}</p>` : ''}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${doc.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">R${item.price.toFixed(2)}</td>
                  <td class="text-right">R${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>R${totals.subtotal.toFixed(2)}</span>
            </div>
            ${totals.taxRateValue > 0 ? `
              <div class="totals-row">
                <span>VAT (${totals.taxRateValue}%):</span>
                <span>R${totals.taxAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            ${totals.discountValue > 0 ? `
              <div class="totals-row">
                <span>Discount:</span>
                <span>-R${totals.discountValue.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="totals-row total">
              <span>Total:</span>
              <span>R${totals.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer-section">
            ${(bankDetails.bankName || bankDetails.bankAccountNumber) ? `
              <div class="banking-details">
                <h4>Banking Details</h4>
                ${bankDetails.bankName ? `<p><strong>Bank:</strong> ${bankDetails.bankName}</p>` : ''}
                ${bankDetails.bankAccountNumber ? `<p><strong>Account:</strong> ${bankDetails.bankAccountNumber}</p>` : ''}
                ${bankDetails.bankAccountType ? `<p><strong>Type:</strong> ${bankDetails.bankAccountType}</p>` : ''}
                ${bankDetails.bankBranchCode ? `<p><strong>Branch:</strong> ${bankDetails.bankBranchCode}</p>` : ''}
                ${bankDetails.bankSwiftCode ? `<p><strong>SWIFT:</strong> ${bankDetails.bankSwiftCode}</p>` : ''}
              </div>
            ` : '<div></div>'}
            <div>
              ${doc.notes ? `
                <div class="notes">
                  <strong>Notes:</strong>
                  <p>${doc.notes}</p>
                </div>
              ` : ''}
              ${doc.terms ? `
                <div class="terms">
                  <strong>Terms & Conditions:</strong>
                  <p>${doc.terms}</p>
                </div>
              ` : ''}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrintQuoteInvoice = (doc) => {
    const printWindow = window.open('', '_blank');
    const html = generateDocumentHTML(doc, false);
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  const handleDownloadQuoteInvoice = (doc) => {
    // Use the same print dialog approach - user can save as PDF from there
    const printWindow = window.open('', '_blank');
    const html = generateDocumentHTML(doc, false);
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  const handlePreviewQuoteInvoice = () => {
    const doc = {
      type: quoteInvoiceType,
      documentNumber: quoteInvoiceForm.documentNumber || generateDocumentNumber(quoteInvoiceType),
      ...quoteInvoiceForm
    };
    setShowPreview(true);
  };

  const loadProjectData = (project) => {
    setQuoteInvoiceForm({
      ...quoteInvoiceForm,
      clientName: project.contactName || '',
      clientEmail: project.contactEmail || '',
      clientPhone: project.contactPhone || '',
      companyName: project.companyName || ''
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <div className="admin-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="admin-title">
                {userRole === 'telesales1' ? 'Telesales Panel' : 'Admin Dashboard'}
                {userRole === 'telesales1' && <span style={{ fontSize: '0.7em', color: '#6B7280', marginLeft: '10px', fontWeight: 'normal' }}>({userRole})</span>}
              </h1>
              <p className="admin-subtitle">
                {userRole === 'telesales1' ? 'Create and manage quotes & invoices' : 'Manage submissions and view analytics'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            {userRole !== 'telesales1' && (
              <>
                <button 
                  className={activeTab === 'overview' ? 'admin-nav-item active' : 'admin-nav-item'}
                  onClick={() => setActiveTab('overview')}
                >
                  <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Overview</span>
                </button>
                <button 
                  className={activeTab === 'contacts' ? 'admin-nav-item active' : 'admin-nav-item'}
                  onClick={() => setActiveTab('contacts')}
                >
                  <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Contact Submissions</span>
                  <span className="nav-badge">{contactSubmissions.length}</span>
                </button>
                <button 
                  className={activeTab === 'projects' ? 'admin-nav-item active' : 'admin-nav-item'}
                  onClick={() => setActiveTab('projects')}
                >
                  <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Project Configurations</span>
                  <span className="nav-badge">{projectConfigs.length}</span>
                </button>
                <button 
                  className={activeTab === 'analytics' ? 'admin-nav-item active' : 'admin-nav-item'}
                  onClick={() => setActiveTab('analytics')}
                >
                  <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Page Analytics</span>
                </button>
              </>
            )}
            <button 
              className={activeTab === 'quotes' ? 'admin-nav-item active' : 'admin-nav-item'}
              onClick={() => setActiveTab('quotes')}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Quotes & Invoices</span>
              <span className="nav-badge">{quotesInvoices.length}</span>
            </button>
            {userRole !== 'telesales1' && (
              <button 
                className={activeTab === 'company-settings' ? 'admin-nav-item active' : 'admin-nav-item'}
                onClick={() => setActiveTab('company-settings')}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Company Settings</span>
              </button>
            )}
          </nav>
        </div>

        <div className="admin-content">
          {userRole !== 'telesales1' && activeTab === 'overview' && (
            <div className="admin-section">
              <div className="section-header">
                <h2 className="section-title">Dashboard Overview</h2>
                <div className="section-actions">
                  <button onClick={loadData} className="action-button refresh">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20.49 15C19.84 16.8399 18.6093 18.4187 17.0019 19.4984C15.3945 20.5781 13.4901 21.1066 11.5449 21.0129C9.59978 20.9192 7.75166 20.2076 6.25605 18.9878C4.76043 17.768 3.6869 16.1009 3.18213 14.221C2.67736 12.341 2.76859 10.3433 3.44424 8.52007C4.11989 6.69681 5.34697 5.14126 6.9519 4.08628C8.55683 3.03129 10.4536 2.52998 12.3788 2.65388C14.3041 2.77779 16.1634 3.52089 17.6569 4.77252L23 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Refresh
                  </button>
                  <button onClick={handleClearData} className="action-button danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Clear All
                  </button>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-card stat-primary">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{contactSubmissions.length}</h3>
                    <p className="stat-label">Contact Submissions</p>
                  </div>
                </div>
                <div className="stat-card stat-success">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{projectConfigs.length}</h3>
                    <p className="stat-label">Project Configurations</p>
                  </div>
                </div>
                <div className="stat-card stat-info">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{pageVisits.length}</h3>
                    <p className="stat-label">Total Page Visits</p>
                  </div>
                </div>
                <div className="stat-card stat-warning">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{Object.keys(visitStats).length}</h3>
                    <p className="stat-label">Unique Pages</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {userRole !== 'telesales1' && activeTab === 'contacts' && (
            <div className="admin-section">
              <div className="section-header">
                <h2 className="section-title">Contact Form Submissions</h2>
                <div className="search-box">
                  <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              {filteredContacts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>No contact submissions</h3>
                  <p>{searchQuery ? 'No results found for your search.' : 'No contact submissions yet.'}</p>
                </div>
              ) : (
                <div className="submissions-list">
                  {filteredContacts.slice().reverse().map((submission) => (
                    <div key={submission.id} className="submission-card">
                      <div className="submission-header">
                        <div className="submission-info">
                          <h3 className="submission-name">{submission.name}</h3>
                          <p className="submission-email">{submission.email}</p>
                        </div>
                        <div className="submission-actions">
                          <div className="submission-meta">
                            <span className="submission-date">
                              {new Date(submission.timestamp).toLocaleDateString()}
                            </span>
                            <span className="submission-time">
                              {new Date(submission.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="card-actions">
                            <a
                              href={`mailto:${submission.email}`}
                              className="action-btn email-btn"
                              title="Send Email"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </a>
                            <button
                              onClick={() => handleDeleteContact(submission.id)}
                              className="action-btn delete-btn"
                              title="Delete Contact"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="submission-message">
                        <div className="message-label">Message</div>
                        <p>{submission.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {userRole !== 'telesales1' && activeTab === 'projects' && (
            <div className="admin-section">
              <div className="section-header">
                <h2 className="section-title">Project Configurations</h2>
                <div className="section-controls">
                  <div className="filter-controls">
                    <select
                      value={projectFilter}
                      onChange={(e) => setProjectFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Types</option>
                      {projectTypes.filter(t => t !== 'all').map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={projectSort}
                      onChange={(e) => setProjectSort(e.target.value)}
                      className="filter-select"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name">Sort by Name</option>
                    </select>
                  </div>
                  <div className="search-box">
                    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
              </div>
              {filteredProjects.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>No project configurations</h3>
                  <p>{searchQuery ? 'No results found for your search.' : 'No project configurations yet.'}</p>
                </div>
              ) : (
                <div className="submissions-list">
                  {filteredProjects.map((config) => {
                    const isExpanded = expandedProjects.has(config.id);
                    return (
                    <div key={config.id} className={`submission-card project-card ${isExpanded ? 'expanded' : ''}`}>
                      <div className="submission-header" onClick={() => toggleProjectExpanded(config.id)} style={{ cursor: 'pointer' }}>
                        <div className="submission-info">
                          <div className="submission-title-row">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleProjectExpanded(config.id);
                              }}
                              className="expand-icon-btn"
                              title={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d={isExpanded ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <h3 className="submission-name">{config.projectName || 'Untitled Project'}</h3>
                            {config.projectType && (
                              <span className="project-type-badge">{config.projectType.replace('-', ' ')}</span>
                            )}
                          </div>
                          <div className="submission-contact">
                            <span className="submission-email">{config.contactEmail}</span>
                            {config.companyName && (
                              <span className="submission-company"> • {config.companyName}</span>
                            )}
                            {config.timeline && (
                              <span className="submission-timeline"> • {config.timeline}</span>
                            )}
                          </div>
                        </div>
                        <div className="submission-actions">
                          <div className="submission-meta">
                            <span className="submission-date">
                              {new Date(config.timestamp).toLocaleDateString()}
                            </span>
                            <span className="submission-time">
                              {new Date(config.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`mailto:${config.contactEmail}`}
                              className="action-btn email-btn"
                              title="Send Email"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </a>
                            <button
                              onClick={() => handleDeleteProject(config.id)}
                              className="action-btn delete-btn"
                              title="Delete Project"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      {isExpanded && (
                      <div className="project-details">
                        {/* Project Information */}
                        <div className="details-section">
                          <h4 className="details-section-title">Project Information</h4>
                          <div className="details-grid">
                            <div className="detail-item">
                              <span className="detail-label">Project Type</span>
                              <span className="detail-value">{config.projectType || 'Not specified'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Timeline</span>
                              <span className="detail-value">{config.timeline || 'Not specified'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Target Audience</span>
                              <span className="detail-value">{config.targetAudience || 'Not specified'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Platforms</span>
                              <span className="detail-value">
                                {Array.isArray(config.platform) && config.platform.length > 0 
                                  ? config.platform.join(', ') 
                                  : 'None'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="details-section">
                          <h4 className="details-section-title">Contact Information</h4>
                          <div className="details-grid">
                            <div className="detail-item">
                              <span className="detail-label">Contact Name</span>
                              <span className="detail-value">{config.contactName || 'Not provided'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Email</span>
                              <span className="detail-value">{config.contactEmail || 'Not provided'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Phone</span>
                              <span className="detail-value">{config.contactPhone || 'Not provided'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Company</span>
                              <span className="detail-value">{config.companyName || 'Not provided'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Design & Branding */}
                        {(config.designStyle || config.colorScheme || config.branding) && (
                          <div className="details-section">
                            <h4 className="details-section-title">Design & Branding</h4>
                            <div className="details-grid">
                              {config.designStyle && (
                                <div className="detail-item">
                                  <span className="detail-label">Design Style</span>
                                  <span className="detail-value">{config.designStyle}</span>
                                </div>
                              )}
                              {config.colorScheme && (
                                <div className="detail-item">
                                  <span className="detail-label">Color Scheme</span>
                                  <span className="detail-value">{config.colorScheme}</span>
                                </div>
                              )}
                              {config.branding && (
                                <div className="detail-item full-width">
                                  <span className="detail-label">Branding Guidelines</span>
                                  <span className="detail-value">{config.branding}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Integrations */}
                        {config.integrations && (
                          <div className="details-section">
                            <h4 className="details-section-title">Required Integrations</h4>
                            <p className="detail-text">{config.integrations}</p>
                          </div>
                        )}

                        {/* Features */}
                        {Array.isArray(config.features) && config.features.length > 0 && (
                          <div className="details-section">
                            <h4 className="details-section-title">Selected Features</h4>
                            <div className="features-list">
                              {config.features.map((feature, idx) => (
                                <span key={idx} className="feature-tag">{feature}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Boolean Features */}
                        {(config.contentManagement || config.userAuthentication || config.paymentIntegration || 
                          config.analytics || config.seoOptimization || config.responsiveDesign) && (
                          <div className="details-section">
                            <h4 className="details-section-title">Additional Features</h4>
                            <div className="boolean-features">
                              {config.contentManagement && <span className="boolean-feature">Content Management</span>}
                              {config.userAuthentication && <span className="boolean-feature">User Authentication</span>}
                              {config.paymentIntegration && <span className="boolean-feature">Payment Integration</span>}
                              {config.analytics && <span className="boolean-feature">Analytics</span>}
                              {config.seoOptimization && <span className="boolean-feature">SEO Optimization</span>}
                              {config.responsiveDesign && <span className="boolean-feature">Responsive Design</span>}
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        {config.description && (
                          <div className="details-section">
                            <h4 className="details-section-title">Project Description</h4>
                            <p className="detail-text">{config.description}</p>
                          </div>
                        )}

                        {/* Additional Notes */}
                        {config.additionalNotes && (
                          <div className="details-section">
                            <h4 className="details-section-title">Additional Notes</h4>
                            <p className="detail-text">{config.additionalNotes}</p>
                          </div>
                        )}

                        {/* Terms Accepted */}
                        {config.termsAccepted && (
                          <div className="details-section">
                            <div className="terms-badge">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Terms and Conditions Accepted
                            </div>
                          </div>
                        )}
                      </div>
                      )}
                    </div>
                  );
                  })}
                </div>
              )}
            </div>
          )}

          {userRole !== 'telesales1' && activeTab === 'analytics' && (
            <div className="admin-section">
              <h2 className="section-title">Page Analytics</h2>
              <div className="analytics-content">
                <div className="analytics-card">
                  <h3 className="analytics-title">Page Visit Statistics</h3>
                  {Object.keys(visitStats).length === 0 ? (
                    <div className="empty-state-small">No page visits recorded yet.</div>
                  ) : (
                    <div className="visit-stats">
                      {Object.entries(visitStats)
                        .sort((a, b) => b[1] - a[1])
                        .map(([path, count]) => (
                          <div key={path} className="visit-stat-item">
                            <div className="visit-stat-info">
                              <span className="visit-path">{path === '/' ? 'Home' : path}</span>
                              <span className="visit-bar">
                                <span 
                                  className="visit-bar-fill" 
                                  style={{ width: `${(count / Math.max(...Object.values(visitStats))) * 100}%` }}
                                ></span>
                              </span>
                            </div>
                            <span className="visit-count">{count}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div className="analytics-card">
                  <h3 className="analytics-title">Recent Visits</h3>
                  {pageVisits.length === 0 ? (
                    <div className="empty-state-small">No visits recorded.</div>
                  ) : (
                    <div className="visits-list">
                      {pageVisits.slice().reverse().slice(0, 50).map((visit) => (
                        <div key={visit.id} className="visit-item">
                          <span className="visit-path">{visit.path === '/' ? 'Home' : visit.path}</span>
                          <span className="visit-time">
                            {new Date(visit.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {activeTab === 'quotes' && (
            <div className="admin-section">
              <div className="section-header">
                <h2 className="section-title">Quotes & Invoices</h2>
                <div className="section-actions">
                  <button 
                    onClick={async () => {
                      // Reload company settings to ensure we have the latest data
                      const settings = await getCompanySettings();
                      setCompanySettings(settings);
                      setEditingQuoteInvoiceId(null);
                      setQuoteInvoiceType('quote');
                      setShowQuoteInvoiceForm(true);
                      setQuoteInvoiceForm({
                        ...quoteInvoiceForm,
                        documentNumber: generateDocumentNumber('quote'),
                        companyName: settings.companyName,
                        companyEmail: settings.companyEmail,
                        companyPhone: settings.companyPhone,
                        companyWebsite: settings.companyWebsite,
                        companyAddress: settings.companyAddress,
                        companyVat: settings.companyVat
                      });
                    }}
                    className="action-button refresh"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    New Quote
                  </button>
                  <button 
                    onClick={async () => {
                      // Reload company settings to ensure we have the latest data
                      const settings = await getCompanySettings();
                      setCompanySettings(settings);
                      setEditingQuoteInvoiceId(null);
                      setQuoteInvoiceType('invoice');
                      setShowQuoteInvoiceForm(true);
                      setQuoteInvoiceForm({
                        ...quoteInvoiceForm,
                        documentNumber: generateDocumentNumber('invoice'),
                        companyName: settings.companyName,
                        companyEmail: settings.companyEmail,
                        companyPhone: settings.companyPhone,
                        companyWebsite: settings.companyWebsite,
                        companyAddress: settings.companyAddress,
                        companyVat: settings.companyVat
                      });
                    }}
                    className="action-button refresh"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    New Invoice
                  </button>
        </div>
      </div>

              {showQuoteInvoiceForm ? (
                <div className="quote-invoice-form-container">
                  <div className="quote-invoice-form-header">
                    <h3>{editingQuoteInvoiceId ? 'Edit' : 'Create New'} {quoteInvoiceType === 'quote' ? 'Quote' : 'Invoice'}</h3>
                    <button onClick={() => {
                      setShowQuoteInvoiceForm(false);
                      setEditingQuoteInvoiceId(null);
                    }} className="close-form-btn">×</button>
    </div>
                  
                  <div className="quote-invoice-form">
                    <div className="form-section-quote">
                      <h4>Document Information</h4>
                      <div className="form-grid-quote">
                        <div className="form-group-quote">
                          <label>Document Number</label>
                          <input
                            type="text"
                            value={quoteInvoiceForm.documentNumber}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, documentNumber: e.target.value })}
                            placeholder="Auto-generated"
                          />
                        </div>
                        <div className="form-group-quote">
                          <label>Issue Date</label>
                          <input
                            type="date"
                            value={quoteInvoiceForm.issueDate}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, issueDate: e.target.value })}
                          />
                        </div>
                        <div className="form-group-quote">
                          <label>Valid Until</label>
                          <input
                            type="date"
                            value={quoteInvoiceForm.dueDate}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, dueDate: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section-quote">
                      <h4>Client Information</h4>
                      <div className="form-grid-quote">
                        <div className="form-group-quote">
                          <label>Client Name *</label>
                          <input
                            type="text"
                            value={quoteInvoiceForm.clientName}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, clientName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group-quote">
                          <label>Client Email</label>
                          <input
                            type="email"
                            value={quoteInvoiceForm.clientEmail}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, clientEmail: e.target.value })}
                          />
                        </div>
                        <div className="form-group-quote">
                          <label>Client Phone</label>
                          <input
                            type="text"
                            value={quoteInvoiceForm.clientPhone}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, clientPhone: e.target.value })}
                          />
                        </div>
                        <div className="form-group-quote full-width">
                          <label>Client Address</label>
                          <textarea
                            value={quoteInvoiceForm.clientAddress}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, clientAddress: e.target.value })}
                            rows="2"
                          />
                        </div>
                        <div className="form-group-quote full-width">
                          <label>Billing Address {quoteInvoiceType === 'invoice' ? '(Shown on Invoice)' : '(For Invoice Only)'}</label>
                          <textarea
                            value={quoteInvoiceForm.billingAddress}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, billingAddress: e.target.value })}
                            rows="2"
                            placeholder="Enter billing address (will only appear on invoices)"
                          />
                        </div>
                      </div>
                      {userRole !== 'telesales1' && projectConfigs.length > 0 && (
                        <div className="form-group-quote">
                          <label>Load from Project:</label>
                          <select
                            onChange={(e) => {
                              const project = projectConfigs.find(p => p.id === e.target.value);
                              if (project) loadProjectData(project);
                            }}
                            className="project-select"
                          >
                            <option value="">Select a project...</option>
                            {projectConfigs.map(proj => (
                              <option key={proj.id} value={proj.id}>
                                {proj.projectName || 'Untitled'} - {proj.contactEmail}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="form-section-quote">
                      <h4>Company Information</h4>
                      {userRole === 'telesales1' && (
                        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                          Company information is managed by administrators and cannot be changed here.
                        </p>
                      )}
                      <div className="form-grid-quote">
                        <div className="form-group-quote">
                          <label>Company Name</label>
                          <input
                            type="text"
                            value={quoteInvoiceForm.companyName}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, companyName: e.target.value })}
                            disabled={userRole === 'telesales1'}
                            readOnly={userRole === 'telesales1'}
                          />
                        </div>
                        <div className="form-group-quote">
                          <label>Company Email</label>
                          <input
                            type="email"
                            value={quoteInvoiceForm.companyEmail}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, companyEmail: e.target.value })}
                            disabled={userRole === 'telesales1'}
                            readOnly={userRole === 'telesales1'}
                          />
                        </div>
                        <div className="form-group-quote">
                          <label>Company Phone</label>
                          <input
                            type="text"
                            value={quoteInvoiceForm.companyPhone}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, companyPhone: e.target.value })}
                            disabled={userRole === 'telesales1'}
                            readOnly={userRole === 'telesales1'}
                          />
                        </div>
                        <div className="form-group-quote">
                          <label>Website</label>
                          <input
                            type="url"
                            value={quoteInvoiceForm.companyWebsite}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, companyWebsite: e.target.value })}
                            placeholder="https://www.example.com"
                            disabled={userRole === 'telesales1'}
                            readOnly={userRole === 'telesales1'}
                          />
                        </div>
                        <div className="form-group-quote">
                          <label>VAT Number</label>
                          <input
                            type="text"
                            value={quoteInvoiceForm.companyVat}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, companyVat: e.target.value })}
                            disabled={userRole === 'telesales1'}
                            readOnly={userRole === 'telesales1'}
                          />
                        </div>
                        <div className="form-group-quote full-width">
                          <label>Company Address</label>
                          <textarea
                            value={quoteInvoiceForm.companyAddress}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, companyAddress: e.target.value })}
                            rows="2"
                            disabled={userRole === 'telesales1'}
                            readOnly={userRole === 'telesales1'}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section-quote">
                      <h4>Items</h4>
                      {quoteInvoiceForm.items.map((item, index) => (
                        <div key={index} className="item-row">
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="item-description"
                          />
                          <input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="item-quantity"
                            min="0"
                            step="1"
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                            className="item-price"
                            min="0"
                            step="0.01"
                          />
                          <span className="item-total">R{(item.quantity * item.price).toFixed(2)}</span>
                          <button onClick={() => removeItem(index)} className="remove-item-btn">×</button>
                        </div>
                      ))}
                      <button onClick={addItem} className="add-item-btn">+ Add Item</button>
                    </div>

                    <div className="form-section-quote">
                      <h4>Pricing</h4>
                      <div className="form-grid-quote">
                        <div className="form-group-quote">
                          <label>VAT (%) <span className="optional-label">(Optional)</span></label>
                          <input
                            type="number"
                            value={quoteInvoiceForm.taxRate}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, taxRate: e.target.value === '' ? '' : parseFloat(e.target.value) || '' })}
                            min="0"
                            step="0.01"
                            placeholder="0"
                          />
                        </div>
                        <div className="form-group-quote">
                          <label>Discount (R) <span className="optional-label">(Optional)</span></label>
                          <input
                            type="number"
                            value={quoteInvoiceForm.discount}
                            onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, discount: e.target.value === '' ? '' : parseFloat(e.target.value) || '' })}
                            min="0"
                            step="0.01"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="totals-preview">
                        {(() => {
                          const totals = calculateTotals(quoteInvoiceForm.items, quoteInvoiceForm.taxRate, quoteInvoiceForm.discount);
                          return (
                            <>
                              <div className="total-row">
                                <span>Subtotal:</span>
                                <span>R{totals.subtotal.toFixed(2)}</span>
                              </div>
                              {totals.taxRateValue > 0 && (
                                <div className="total-row">
                                  <span>VAT ({totals.taxRateValue}%):</span>
                                  <span>R{totals.taxAmount.toFixed(2)}</span>
                                </div>
                              )}
                              {totals.discountValue > 0 && (
                                <div className="total-row">
                                  <span>Discount:</span>
                                  <span>-R{totals.discountValue.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="total-row total-final">
                                <span>Total:</span>
                                <span>R{totals.total.toFixed(2)}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="form-section-quote">
                      <h4>Notes & Terms</h4>
                      <div className="form-group-quote">
                        <label>Notes</label>
                        <textarea
                          value={quoteInvoiceForm.notes}
                          onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, notes: e.target.value })}
                          rows="3"
                          placeholder="Additional notes..."
                        />
                      </div>
                      <div className="form-group-quote">
                        <label>Terms & Conditions</label>
                        <textarea
                          value={quoteInvoiceForm.terms}
                          onChange={(e) => setQuoteInvoiceForm({ ...quoteInvoiceForm, terms: e.target.value })}
                          rows="4"
                        />
                      </div>
                    </div>

                    <div className="form-actions-quote">
                      <button onClick={() => setShowQuoteInvoiceForm(false)} className="cancel-btn">Cancel</button>
                      <button onClick={handlePreviewQuoteInvoice} className="preview-btn">Preview</button>
                      <button onClick={handleSaveQuoteInvoice} className="save-btn">Save {quoteInvoiceType === 'quote' ? 'Quote' : 'Invoice'}</button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {quotesInvoices.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3>No quotes or invoices</h3>
                      <p>Create your first quote or invoice to get started.</p>
                    </div>
                  ) : (
                    <div className="quotes-invoices-list">
                      {quotesInvoices.map((doc) => {
                        const totals = calculateTotals(doc.items, doc.taxRate, doc.discount);
                        return (
                          <div key={doc.id} className="quote-invoice-card">
                            <div className="quote-invoice-header">
                              <div className="quote-invoice-info">
                                <div className="quote-invoice-title-row">
                                  <h3>{doc.documentNumber}</h3>
                                  <span className={`status-badge status-${doc.status}`}>{doc.status}</span>
                                </div>
                                <p className="quote-invoice-type">{doc.type === 'quote' ? 'Quote' : 'Invoice'}</p>
                                <p className="quote-invoice-client">{doc.clientName}</p>
                                <p className="quote-invoice-date">
                                  Issue: {new Date(doc.issueDate).toLocaleDateString()}
                                  {(() => {
                                    const validDays = calculateValidDays(doc.issueDate, doc.dueDate);
                                    return validDays ? ` • Valid for ${validDays} ${validDays === 1 ? 'day' : 'days'}` : '';
                                  })()}
                                </p>
                                <p className="quote-invoice-total">Total: R{totals.total.toFixed(2)}</p>
                              </div>
                              <div className="quote-invoice-actions">
                                <select
                                  value={doc.status}
                                  onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                                  className="status-select"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="sent">Sent</option>
                                  <option value="accepted">Accepted</option>
                                  <option value="rejected">Rejected</option>
                                  {doc.type === 'invoice' && (
                                    <>
                                      <option value="unpaid">Unpaid</option>
                                      <option value="paid">Paid</option>
                                      <option value="overdue">Overdue</option>
                                    </>
                                  )}
                                </select>
                                <button
                                  onClick={() => handleEditQuoteInvoice(doc)}
                                  className="action-btn edit-btn"
                                  title="Edit"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                {doc.type === 'quote' && (
                                  <button
                                    onClick={() => handleConvertQuoteToInvoice(doc)}
                                    className="action-btn convert-btn"
                                    title="Convert to Invoice"
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M7 16V4M7 4L3 8M7 4L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M17 8V20M17 20L21 16M17 20L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                )}
                                <button
                                  onClick={() => handlePrintQuoteInvoice(doc)}
                                  className="action-btn email-btn"
                                  title="Print"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9V2H18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18 14H6V22H18V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDownloadQuoteInvoice(doc)}
                                  className="action-btn download-btn"
                                  title="Download PDF"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteQuoteInvoice(doc.id)}
                                  className="action-btn delete-btn"
                                  title="Delete"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {userRole !== 'telesales1' && activeTab === 'company-settings' && (
            <div className="admin-section">
              <div className="section-header">
                <h2 className="section-title">Company Settings</h2>
              </div>
              <div className="company-settings-container">
                <div className="form-section-quote">
                  <h4>Document Prefixes</h4>
                  <div className="form-grid-quote">
                    <div className="form-group-quote">
                      <label>Quote Prefix Type</label>
                      <select
                        value={companySettings.quotePrefixType}
                        onChange={(e) => setCompanySettings({ ...companySettings, quotePrefixType: e.target.value })}
                      >
                        <option value="custom">Custom</option>
                        <option value="random">Random</option>
                      </select>
                    </div>
                    {companySettings.quotePrefixType === 'custom' && (
                      <div className="form-group-quote">
                        <label>Quote Prefix</label>
                        <input
                          type="text"
                          value={companySettings.quotePrefix}
                          onChange={(e) => setCompanySettings({ ...companySettings, quotePrefix: e.target.value.toUpperCase() })}
                          placeholder="QUO"
                          maxLength="10"
                        />
                      </div>
                    )}
                    <div className="form-group-quote">
                      <label>Invoice Prefix Type</label>
                      <select
                        value={companySettings.invoicePrefixType}
                        onChange={(e) => setCompanySettings({ ...companySettings, invoicePrefixType: e.target.value })}
                      >
                        <option value="custom">Custom</option>
                        <option value="random">Random</option>
                      </select>
                    </div>
                    {companySettings.invoicePrefixType === 'custom' && (
                      <div className="form-group-quote">
                        <label>Invoice Prefix</label>
                        <input
                          type="text"
                          value={companySettings.invoicePrefix}
                          onChange={(e) => setCompanySettings({ ...companySettings, invoicePrefix: e.target.value.toUpperCase() })}
                          placeholder="INV"
                          maxLength="10"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-section-quote">
                  <h4>Company Information</h4>
                  <div className="form-grid-quote">
                    <div className="form-group-quote">
                      <label>Company Name</label>
                      <input
                        type="text"
                        value={companySettings.companyName}
                        onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                      />
                    </div>
                    <div className="form-group-quote">
                      <label>Company Email</label>
                      <input
                        type="email"
                        value={companySettings.companyEmail}
                        onChange={(e) => setCompanySettings({ ...companySettings, companyEmail: e.target.value })}
                      />
                    </div>
                    <div className="form-group-quote">
                      <label>Company Phone</label>
                      <input
                        type="text"
                        value={companySettings.companyPhone}
                        onChange={(e) => setCompanySettings({ ...companySettings, companyPhone: e.target.value })}
                      />
                    </div>
                    <div className="form-group-quote">
                      <label>Website</label>
                      <input
                        type="url"
                        value={companySettings.companyWebsite}
                        onChange={(e) => setCompanySettings({ ...companySettings, companyWebsite: e.target.value })}
                        placeholder="https://www.example.com"
                      />
                    </div>
                    <div className="form-group-quote">
                      <label>VAT Number (Optional)</label>
                      <input
                        type="text"
                        value={companySettings.companyVat}
                        onChange={(e) => setCompanySettings({ ...companySettings, companyVat: e.target.value })}
                        placeholder="VAT123456789"
                      />
                    </div>
                    <div className="form-group-quote full-width">
                      <label>Company Address</label>
                      <textarea
                        value={companySettings.companyAddress}
                        onChange={(e) => setCompanySettings({ ...companySettings, companyAddress: e.target.value })}
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section-quote">
                  <h4>Banking Details</h4>
                  <div className="form-grid-quote">
                    <div className="form-group-quote">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        value={companySettings.bankName}
                        onChange={(e) => setCompanySettings({ ...companySettings, bankName: e.target.value })}
                      />
                    </div>
                    <div className="form-group-quote">
                      <label>Account Number</label>
                      <input
                        type="text"
                        value={companySettings.bankAccountNumber}
                        onChange={(e) => setCompanySettings({ ...companySettings, bankAccountNumber: e.target.value })}
                      />
                    </div>
                    <div className="form-group-quote">
                      <label>Account Type</label>
                      <input
                        type="text"
                        value={companySettings.bankAccountType}
                        onChange={(e) => setCompanySettings({ ...companySettings, bankAccountType: e.target.value })}
                        placeholder="e.g., Current, Savings"
                      />
                    </div>
                    <div className="form-group-quote">
                      <label>Branch Code</label>
                      <input
                        type="text"
                        value={companySettings.bankBranchCode}
                        onChange={(e) => setCompanySettings({ ...companySettings, bankBranchCode: e.target.value })}
                      />
                    </div>
                    <div className="form-group-quote">
                      <label>SWIFT Code</label>
                      <input
                        type="text"
                        value={companySettings.bankSwiftCode}
                        onChange={(e) => setCompanySettings({ ...companySettings, bankSwiftCode: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions-quote">
                  <button
                    onClick={async () => {
                      try {
                        await saveCompanySettings(companySettings);
                        alert('Company settings saved successfully!');
                        // Reload data to ensure all users see the updated settings
                        await loadData();
                        // Also update the quote invoice form if it's open
                        if (showQuoteInvoiceForm) {
                          const settings = await getCompanySettings();
                          setQuoteInvoiceForm(prev => ({
                            ...prev,
                            companyName: settings.companyName,
                            companyEmail: settings.companyEmail,
                            companyPhone: settings.companyPhone,
                            companyWebsite: settings.companyWebsite,
                            companyAddress: settings.companyAddress,
                            companyVat: settings.companyVat
                          }));
                        }
                      } catch (error) {
                        console.error('Error saving company settings:', error);
                        const errorMessage = error?.message || error?.error_description || 'Unknown error';
                        alert(`Failed to save settings: ${errorMessage}\n\nPlease check the browser console for more details.`);
                      }
                    }}
                    className="save-btn"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h3>Preview {quoteInvoiceType === 'quote' ? 'Quote' : 'Invoice'}</h3>
              <button onClick={() => setShowPreview(false)} className="close-form-btn">×</button>
            </div>
            <div className="preview-modal-body">
              <iframe
                srcDoc={generateDocumentHTML({
                  type: quoteInvoiceType,
                  documentNumber: quoteInvoiceForm.documentNumber || generateDocumentNumber(quoteInvoiceType),
                  ...quoteInvoiceForm
                }, true)}
                className="preview-iframe"
                title="Preview"
              />
            </div>
            <div className="preview-modal-footer">
              <button onClick={() => setShowPreview(false)} className="cancel-btn">Close</button>
              <button
                onClick={() => {
                  const doc = {
                    type: quoteInvoiceType,
                    documentNumber: quoteInvoiceForm.documentNumber || generateDocumentNumber(quoteInvoiceType),
                    ...quoteInvoiceForm
                  };
                  handlePrintQuoteInvoice(doc);
                }}
                className="save-btn"
              >
                Print
              </button>
              <button
                onClick={() => {
                  const doc = {
                    type: quoteInvoiceType,
                    documentNumber: quoteInvoiceForm.documentNumber || generateDocumentNumber(quoteInvoiceType),
                    ...quoteInvoiceForm
                  };
                  handleDownloadQuoteInvoice(doc);
                }}
                className="save-btn"
                style={{ marginLeft: '10px' }}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
