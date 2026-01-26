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

// Quotes and Invoices
export const saveQuoteOrInvoice = async (data) => {
  try {
    const payload = {
      type: data.type, // 'quote' or 'invoice'
      document_number: data.documentNumber,
      client_name: data.clientName,
      client_email: data.clientEmail,
      client_phone: data.clientPhone,
      client_address: data.clientAddress,
      billing_address: data.billingAddress || null,
      company_name: data.companyName,
      company_email: data.companyEmail,
      company_phone: data.companyPhone,
      company_website: data.companyWebsite || null,
      company_address: data.companyAddress,
      company_vat: data.companyVat,
      items: data.items || [],
      subtotal: data.subtotal,
      tax_rate: data.taxRate || 0,
      tax_amount: data.taxAmount || 0,
      discount: data.discount || 0,
      total: data.total,
      notes: data.notes,
      terms: data.terms,
      issue_date: data.issueDate,
      due_date: data.dueDate,
      status: data.status || (data.type === 'quote' ? 'pending' : 'unpaid')
    };

    let doc, error;
    
    // If ID exists, update; otherwise insert
    if (data.id) {
      const result = await supabase
        .from('quotes_invoices')
        .update(payload)
        .eq('id', data.id)
        .select()
        .single();
      doc = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from('quotes_invoices')
        .insert([payload])
        .select()
        .single();
      doc = result.data;
      error = result.error;
    }

    if (error) throw error;
    
    return {
      id: doc.id,
      type: doc.type,
      documentNumber: doc.document_number,
      clientName: doc.client_name,
      clientEmail: doc.client_email,
      clientPhone: doc.client_phone,
      clientAddress: doc.client_address,
      billingAddress: doc.billing_address || '',
      companyName: doc.company_name,
      companyEmail: doc.company_email,
      companyPhone: doc.company_phone,
      companyWebsite: doc.company_website || '',
      companyAddress: doc.company_address,
      companyVat: doc.company_vat,
      items: doc.items,
      subtotal: doc.subtotal,
      taxRate: doc.tax_rate,
      taxAmount: doc.tax_amount,
      discount: doc.discount,
      total: doc.total,
      notes: doc.notes,
      terms: doc.terms,
      issueDate: doc.issue_date,
      dueDate: doc.due_date,
      status: doc.status,
      timestamp: doc.created_at
    };
  } catch (error) {
    console.error('Error saving quote/invoice:', error);
    throw error;
  }
};

export const getQuotesAndInvoices = async () => {
  try {
    const { data, error } = await supabase
      .from('quotes_invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(doc => ({
      id: doc.id,
      type: doc.type,
      documentNumber: doc.document_number,
      clientName: doc.client_name,
      clientEmail: doc.client_email,
      clientPhone: doc.client_phone,
      clientAddress: doc.client_address,
      billingAddress: doc.billing_address || '',
      companyName: doc.company_name,
      companyEmail: doc.company_email,
      companyPhone: doc.company_phone,
      companyWebsite: doc.company_website || '',
      companyAddress: doc.company_address,
      companyVat: doc.company_vat,
      items: doc.items,
      subtotal: doc.subtotal,
      taxRate: doc.tax_rate,
      taxAmount: doc.tax_amount,
      discount: doc.discount,
      total: doc.total,
      notes: doc.notes,
      terms: doc.terms,
      issueDate: doc.issue_date,
      dueDate: doc.due_date,
      status: doc.status,
      timestamp: doc.created_at
    }));
  } catch (error) {
    console.error('Error fetching quotes/invoices:', error);
    return [];
  }
};

export const deleteQuoteOrInvoice = async (id) => {
  try {
    const { error } = await supabase
      .from('quotes_invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting quote/invoice:', error);
    throw error;
  }
};

export const updateQuoteOrInvoiceStatus = async (id, status) => {
  try {
    const { error } = await supabase
      .from('quotes_invoices')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating quote/invoice status:', error);
    throw error;
  }
};

// Company Settings
export const saveCompanySettings = async (data) => {
  try {
    // Helper function to convert empty strings to null
    const nullIfEmpty = (value) => (value === '' || value === null || value === undefined ? null : value);
    
    const { data: settings, error } = await supabase
      .from('company_settings')
      .upsert(
        {
          id: '00000000-0000-0000-0000-000000000002',
          quote_prefix: data.quotePrefix || 'QUO',
          invoice_prefix: data.invoicePrefix || 'INV',
          quote_prefix_type: data.quotePrefixType || 'custom', // 'custom' or 'random'
          invoice_prefix_type: data.invoicePrefixType || 'custom',
          company_name: data.companyName || 'INVEXB',
          company_email: nullIfEmpty(data.companyEmail),
          company_phone: nullIfEmpty(data.companyPhone),
          company_website: nullIfEmpty(data.companyWebsite),
          company_address: nullIfEmpty(data.companyAddress),
          company_vat: nullIfEmpty(data.companyVat),
          bank_name: nullIfEmpty(data.bankName),
          bank_account_number: nullIfEmpty(data.bankAccountNumber),
          bank_account_type: nullIfEmpty(data.bankAccountType),
          bank_branch_code: nullIfEmpty(data.bankBranchCode),
          bank_swift_code: nullIfEmpty(data.bankSwiftCode)
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    
    return {
      quotePrefix: settings.quote_prefix,
      invoicePrefix: settings.invoice_prefix,
      quotePrefixType: settings.quote_prefix_type,
      invoicePrefixType: settings.invoice_prefix_type,
      companyName: settings.company_name,
      companyEmail: settings.company_email,
      companyPhone: settings.company_phone,
      companyWebsite: settings.company_website,
      companyAddress: settings.company_address,
      companyVat: settings.company_vat,
      bankName: settings.bank_name,
      bankAccountNumber: settings.bank_account_number,
      bankAccountType: settings.bank_account_type,
      bankBranchCode: settings.bank_branch_code,
      bankSwiftCode: settings.bank_swift_code
    };
  } catch (error) {
    console.error('Error saving company settings:', error);
    throw error;
  }
};

export const getCompanySettings = async () => {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000002')
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('not found')) {
        return {
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
        };
      }
      throw error;
    }

    if (!data) {
      return {
        quotePrefix: 'QUO',
        invoicePrefix: 'INV',
        quotePrefixType: 'custom',
        invoicePrefixType: 'custom',
        companyName: 'INVEXB',
        companyEmail: 'info@invexb.com',
        companyPhone: '',
        companyAddress: '',
        companyVat: '',
        bankName: '',
        bankAccountNumber: '',
        bankAccountType: '',
        bankBranchCode: '',
        bankSwiftCode: ''
      };
    }
    
    return {
      quotePrefix: data.quote_prefix || 'QUO',
      invoicePrefix: data.invoice_prefix || 'INV',
      quotePrefixType: data.quote_prefix_type || 'custom',
      invoicePrefixType: data.invoice_prefix_type || 'custom',
      companyName: data.company_name || 'INVEXB',
      companyEmail: data.company_email || 'info@invexb.com',
      companyPhone: data.company_phone || '',
      companyWebsite: data.company_website || '',
      companyAddress: data.company_address || '',
      companyVat: data.company_vat || '',
      bankName: data.bank_name || '',
      bankAccountNumber: data.bank_account_number || '',
      bankAccountType: data.bank_account_type || '',
      bankBranchCode: data.bank_branch_code || '',
      bankSwiftCode: data.bank_swift_code || ''
    };
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return {
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
    };
  }
};
