import './Terms.css';

function Terms() {
  return (
    <div className="terms-page">
      <section className="terms-hero">
        <div className="terms-hero-container">
          <h1 className="terms-hero-title">Terms and Conditions</h1>
          <p className="terms-hero-subtitle">
            Last Updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="terms-content">
        <div className="terms-container">
          <div className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the services of INVEXB PTY LTD ("Company", "we", "us", "our"), you ("Client", "you", "your") 
              acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not 
              agree to these terms, you must not use our services.
            </p>
          </div>

          <div className="terms-section">
            <h2>2. Services and Pricing</h2>
            <h3>2.1 Starting Prices</h3>
            <p>
              All prices quoted on our website are <strong>starting prices</strong> for basic service packages. These prices 
              represent the minimum cost for standard implementations and include only basic features and 1-2 major features as 
              specified in the service description.
            </p>

            <h3>2.2 Additional Features and Complexity</h3>
            <p>
              The Company reserves the absolute right to:
            </p>
            <ul>
              <li>
                Charge additional fees for features beyond the basic package. Additional features may cost as low as R999 per 
                feature, but pricing will be determined based on complexity, development time, and resource requirements.
              </li>
              <li>
                Decline any project if the complexity, scope, or requirements exceed our capacity or reasonable expectations, 
                or if the project poses technical, legal, or business risks that we deem unacceptable.
              </li>
              <li>
                Require additional payment if the project complexity exceeds the initial assessment. The Company will notify 
                the Client in writing before proceeding with work that exceeds the original scope, and the Client must approve 
                additional charges in writing before such work commences.
              </li>
              <li>
                Revise pricing if the Client requests changes, additions, or modifications to the original project scope after 
                the initial agreement has been made.
              </li>
            </ul>

            <h3>2.3 Project Scope and Complexity Assessment</h3>
            <p>
              The Company will conduct an initial assessment of project complexity. However, the Company reserves the right to 
              re-evaluate complexity at any stage of development. If complexity is determined to exceed initial estimates, the 
              Company may:
            </p>
            <ul>
              <li>Request additional payment before continuing work</li>
              <li>Modify the project timeline</li>
              <li>Decline to proceed with the project</li>
              <li>Propose an alternative solution within the original budget</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>3. Payment Terms</h2>
            <p>
              Payment terms will be specified in individual project agreements. The Company reserves the right to:
            </p>
            <ul>
              <li>Require a deposit before commencing work</li>
              <li>Request milestone payments for larger projects</li>
              <li>Suspend or terminate services for non-payment</li>
              <li>Charge interest on overdue payments at the maximum rate permitted by South African law</li>
              <li>Recover all costs, including legal fees, incurred in collecting overdue amounts</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>4. Intellectual Property</h2>
            <p>
              All intellectual property rights in the work product, including but not limited to code, designs, documentation, 
              and methodologies, shall remain the property of the Company until full payment has been received. Upon full payment, 
              the Client will receive a license to use the work product as specified in the project agreement. The Company 
              reserves all rights to use general knowledge, skills, and experience gained during the project.
            </p>
          </div>

          <div className="terms-section">
            <h2>5. Warranties and Disclaimers</h2>
            <p>
              The Company provides services on an "as is" basis. While we strive for excellence, we make no warranties, 
              express or implied, regarding:
            </p>
            <ul>
              <li>The uninterrupted or error-free operation of any software or service</li>
              <li>The compatibility of software with all hardware or software configurations</li>
              <li>The achievement of specific business results or outcomes</li>
              <li>The security of data or systems beyond industry-standard practices</li>
            </ul>
            <p>
              The Company's liability is limited to the amount paid by the Client for the specific service giving rise to the 
              claim. The Company shall not be liable for any indirect, consequential, or special damages, including but not 
              limited to loss of profits, data, or business opportunities.
            </p>
          </div>

          <div className="terms-section">
            <h2>6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by South African law, the Company's total liability for any claims arising from 
              or related to our services shall not exceed the total amount paid by the Client to the Company in the twelve (12) 
              months preceding the claim. The Company shall not be liable for:
            </p>
            <ul>
              <li>Third-party actions or failures</li>
              <li>Force majeure events</li>
              <li>Client's misuse of services</li>
              <li>Unauthorized access to Client systems</li>
              <li>Changes to third-party services or APIs</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>7. Client Obligations</h2>
            <p>
              The Client agrees to:
            </p>
            <ul>
              <li>Provide accurate, complete, and timely information necessary for project completion</li>
              <li>Respond to requests for feedback, approval, or information within reasonable timeframes</li>
              <li>Ensure they have the legal right to use any content, data, or materials provided to the Company</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not use the services for any illegal or unauthorized purpose</li>
              <li>Maintain confidentiality of any login credentials or access information provided</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>8. Termination</h2>
            <p>
              Either party may terminate a project agreement with written notice. Upon termination:
            </p>
            <ul>
              <li>The Client shall pay for all work completed up to the date of termination</li>
              <li>The Company may retain all work product until full payment is received</li>
              <li>All confidentiality obligations shall survive termination</li>
              <li>The Company reserves the right to terminate immediately for breach of these terms or non-payment</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>9. Confidentiality</h2>
            <p>
              Both parties agree to maintain confidentiality of proprietary information shared during the course of the project. 
              This obligation survives termination of the agreement. The Company may be willing to enter into a Non-Disclosure 
              Agreement (NDA) if requested by the Client, subject to separate negotiation.
            </p>
          </div>

          <div className="terms-section">
            <h2>10. Force Majeure</h2>
            <p>
              The Company shall not be liable for delays or failures in performance resulting from circumstances beyond our 
              reasonable control, including but not limited to natural disasters, war, terrorism, pandemics, government actions, 
              internet failures, or third-party service outages.
            </p>
          </div>

          <div className="terms-section">
            <h2>11. Dispute Resolution</h2>
            <p>
              Any disputes arising from these terms or our services shall first be addressed through good faith negotiation. 
              If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the Arbitration 
              Act of South Africa, or through the courts of South Africa, at the Company's discretion. The parties agree to 
              submit to the exclusive jurisdiction of the courts of South Africa.
            </p>
          </div>

          <div className="terms-section">
            <h2>12. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of South 
              Africa. Any legal proceedings shall be conducted in the courts of South Africa.
            </p>
          </div>

          <div className="terms-section">
            <h2>13. Amendments</h2>
            <p>
              The Company reserves the right to modify these Terms and Conditions at any time. Material changes will be 
              communicated to Clients via email or through our website. Continued use of our services after changes constitutes 
              acceptance of the modified terms.
            </p>
          </div>

          <div className="terms-section">
            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms and Conditions is found to be invalid, illegal, or unenforceable, the remaining 
              provisions shall continue in full force and effect. The invalid provision shall be replaced with a valid provision 
              that most closely reflects the intent of the original provision.
            </p>
          </div>

          <div className="terms-section">
            <h2>15. Entire Agreement</h2>
            <p>
              These Terms and Conditions, together with any project-specific agreements, constitute the entire agreement between 
              the parties regarding the subject matter hereof and supersede all prior agreements, understandings, or communications, 
              whether written or oral.
            </p>
          </div>

          <div className="terms-section">
            <h2>16. Contact Information</h2>
            <p>
              For questions regarding these Terms and Conditions, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> support@invexb.com<br />
              <strong>Company:</strong> INVEXB PTY LTD<br />
              <strong>Country:</strong> South Africa
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Terms;

