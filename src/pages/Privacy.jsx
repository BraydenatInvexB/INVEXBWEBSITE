import './Privacy.css';

function Privacy() {
  return (
    <div className="privacy-page">
      <section className="privacy-hero">
        <div className="privacy-hero-container">
          <h1 className="privacy-hero-title">Privacy Policy</h1>
          <p className="privacy-hero-subtitle">
            Last Updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="privacy-content">
        <div className="privacy-container">
          <div className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              INVEXB PTY LTD ("Company", "we", "us", "our") is committed to protecting your privacy and personal information. This 
              Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services 
              or visit our website. This policy is compliant with the Protection of Personal Information Act (POPI Act) of 
              South Africa and other applicable data protection laws.
            </p>
            <p>
              By using our services, you consent to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </div>

          <div className="privacy-section">
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>
              We collect personal information necessary to provide our services, including but not limited to:
            </p>
            <ul>
              <li>Name, email address, phone number, and physical address</li>
              <li>Company name and business information</li>
              <li>Payment and billing information</li>
              <li>Project requirements, specifications, and technical details</li>
              <li>Communication records, including emails, messages, and meeting notes</li>
              <li>Account credentials and access information (where applicable)</li>
            </ul>

            <h3>2.2 Technical Information</h3>
            <p>
              We automatically collect certain technical information when you visit our website:
            </p>
            <ul>
              <li>IP address, browser type, and device information</li>
              <li>Website usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Page views, session duration, and navigation patterns</li>
            </ul>

            <h3>2.3 Project and Application Information</h3>
            <p>
              To provide our services effectively, we collect comprehensive information about your project and application, 
              including:
            </p>
            <ul>
              <li>Application architecture, design specifications, and technical requirements</li>
              <li>Business logic, workflows, and functional requirements</li>
              <li>Data models, database schemas, and integration requirements</li>
              <li>Third-party service integrations and API specifications</li>
              <li>User authentication and authorization requirements</li>
              <li>Security requirements and compliance needs</li>
              <li>Performance requirements and scalability considerations</li>
            </ul>
            <p>
              This information is essential for project planning, development, and delivery. We treat all project information 
              as confidential and proprietary.
            </p>
          </div>

          <div className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <p>
              We use the collected information for the following purposes:
            </p>
            <ul>
              <li>
                <strong>Service Delivery:</strong> To provide, maintain, and improve our software development services, 
                including project planning, development, testing, deployment, and maintenance.
              </li>
              <li>
                <strong>Communication:</strong> To communicate with you about your project, respond to inquiries, provide 
                updates, and send important notices.
              </li>
              <li>
                <strong>Business Operations:</strong> To process payments, manage accounts, maintain records, and comply with 
                legal obligations.
              </li>
              <li>
                <strong>Quality Assurance:</strong> To ensure quality, troubleshoot issues, and improve our services.
              </li>
              <li>
                <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, court orders, and government 
                requests.
              </li>
              <li>
                <strong>Business Development:</strong> To analyze usage patterns, improve our services, and develop new 
                offerings (using aggregated, anonymized data where possible).
              </li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>4. Disclosure of Information to Third Parties</h2>
            <p>
              We may share your information with third-party service providers and partners in the following circumstances:
            </p>

            <h3>4.1 Service Providers</h3>
            <p>
              We engage third-party service providers to assist with various aspects of our business operations, including:
            </p>
            <ul>
              <li>
                <strong>Cloud Hosting and Infrastructure:</strong> We may share application data and configurations with cloud 
                hosting providers (e.g., AWS, Azure, Google Cloud) for deployment and hosting purposes.
              </li>
              <li>
                <strong>Payment Processors:</strong> Payment information is shared with payment processors to facilitate 
                transactions. We do not store full credit card details.
              </li>
              <li>
                <strong>Development Tools and Platforms:</strong> We may use third-party development tools, version control 
                systems, project management platforms, and collaboration tools that require access to project information.
              </li>
              <li>
                <strong>Analytics and Monitoring:</strong> We use analytics services to understand website usage and application 
                performance.
              </li>
              <li>
                <strong>Communication Services:</strong> Email and messaging services for client communication.
              </li>
              <li>
                <strong>Security Services:</strong> Security monitoring, threat detection, and data protection services.
              </li>
            </ul>

            <h3>4.2 Legal Requirements</h3>
            <p>
              We may disclose your information if required by law, regulation, court order, or government request, including:
            </p>
            <ul>
              <li>Compliance with legal obligations under South African law</li>
              <li>Responding to subpoenas, warrants, or court orders</li>
              <li>Protecting our rights, property, or safety, or that of our clients or others</li>
              <li>Investigating fraud, security breaches, or violations of our terms</li>
            </ul>

            <h3>4.3 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, sale of assets, or bankruptcy, your information may be transferred to the 
              acquiring entity, subject to the same privacy protections.
            </p>

            <h3>4.4 With Your Consent</h3>
            <p>
              We may share your information with third parties when you have explicitly consented to such sharing.
            </p>

            <p>
              <strong>Important:</strong> All third-party service providers are contractually obligated to protect your 
              information and use it only for the purposes for which it was shared. We conduct due diligence on third-party 
              providers to ensure they meet appropriate security and privacy standards.
            </p>
          </div>

          <div className="privacy-section">
            <h2>5. Non-Disclosure Agreements (NDAs)</h2>
            <p>
              We understand the sensitive nature of project information and application details. Upon request, we are willing 
              to enter into a Non-Disclosure Agreement (NDA) to provide additional legal protection for your confidential 
              information. NDAs will be negotiated separately and will supplement, not replace, the protections outlined in 
              this Privacy Policy.
            </p>
            <p>
              Even without a formal NDA, we treat all client information as confidential and proprietary, and we maintain 
              strict confidentiality standards in accordance with industry best practices and legal requirements.
            </p>
          </div>

          <div className="privacy-section">
            <h2>6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information from unauthorized access, alteration, 
              disclosure, or destruction, including:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure access controls and authentication mechanisms</li>
              <li>Regular security assessments and vulnerability testing</li>
              <li>Employee training on data protection and confidentiality</li>
              <li>Secure data centers and infrastructure</li>
              <li>Incident response procedures</li>
            </ul>
            <p>
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to 
              use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </div>

          <div className="privacy-section">
            <h2>7. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to:
            </p>
            <ul>
              <li>Provide our services and fulfill our contractual obligations</li>
              <li>Comply with legal, regulatory, and tax requirements</li>
              <li>Resolve disputes and enforce our agreements</li>
              <li>Maintain business records for legitimate business purposes</li>
            </ul>
            <p>
              Project information and application data may be retained for extended periods to support ongoing maintenance, 
              updates, and legal compliance. When information is no longer needed, we will securely delete or anonymize it in 
              accordance with our data retention policies and applicable law.
            </p>
          </div>

          <div className="privacy-section">
            <h2>8. Your Rights Under POPI Act</h2>
            <p>
              Under the Protection of Personal Information Act (POPI Act) of South Africa, you have the following rights:
            </p>
            <ul>
              <li>
                <strong>Right to Access:</strong> You may request access to the personal information we hold about you.
              </li>
              <li>
                <strong>Right to Correction:</strong> You may request correction of inaccurate or incomplete information.
              </li>
              <li>
                <strong>Right to Deletion:</strong> You may request deletion of your personal information, subject to legal 
                and contractual obligations that require retention.
              </li>
              <li>
                <strong>Right to Object:</strong> You may object to the processing of your personal information in certain 
                circumstances.
              </li>
              <li>
                <strong>Right to Restrict Processing:</strong> You may request restriction of processing in certain situations.
              </li>
              <li>
                <strong>Right to Data Portability:</strong> You may request transfer of your data to another service provider 
                where technically feasible.
              </li>
              <li>
                <strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you may withdraw consent at 
                any time.
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us at support@invexb.com. We will respond to your request within a 
              reasonable timeframe and in accordance with applicable law.
            </p>
          </div>

          <div className="privacy-section">
            <h2>9. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small 
              data files stored on your device that help us:
            </p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve website functionality and performance</li>
            </ul>
            <p>
              You can control cookies through your browser settings. However, disabling cookies may limit your ability to use 
              certain features of our website.
            </p>
          </div>

          <div className="privacy-section">
            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than South Africa, including countries 
              where our third-party service providers operate. We ensure that appropriate safeguards are in place to protect 
              your information in accordance with this Privacy Policy and applicable data protection laws.
            </p>
          </div>

          <div className="privacy-section">
            <h2>11. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information 
              from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </div>

          <div className="privacy-section">
            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal 
              requirements, or other factors. Material changes will be communicated to you via email or through our website. 
              Your continued use of our services after changes become effective constitutes acceptance of the updated Privacy 
              Policy.
            </p>
          </div>

          <div className="privacy-section">
            <h2>13. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, the Company shall not be liable for any loss, damage, or harm arising 
              from:
            </p>
            <ul>
              <li>Unauthorized access to or use of your information</li>
              <li>Third-party breaches or security incidents</li>
              <li>Technical failures or errors beyond our reasonable control</li>
              <li>Your failure to maintain the security of your account credentials</li>
            </ul>
            <p>
              Our liability is limited to the maximum extent permitted by South African law.
            </p>
          </div>

          <div className="privacy-section">
            <h2>14. Governing Law</h2>
            <p>
              This Privacy Policy is governed by and construed in accordance with the laws of the Republic of South Africa, 
              including the Protection of Personal Information Act (POPI Act). Any disputes arising from this Privacy Policy 
              shall be subject to the exclusive jurisdiction of the courts of South Africa.
            </p>
          </div>

          <div className="privacy-section">
            <h2>15. Contact Information</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please 
              contact us at:
            </p>
            <p>
              <strong>Email:</strong> support@invexb.com<br />
              <strong>Company:</strong> INVEXB PTY LTD<br />
              <strong>Country:</strong> South Africa<br />
              <strong>Data Protection Officer:</strong> Available upon request
            </p>
            <p>
              We are committed to addressing your privacy concerns promptly and in accordance with applicable law.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Privacy;

