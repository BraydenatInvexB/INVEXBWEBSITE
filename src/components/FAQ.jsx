import { useState } from 'react';
import './FAQ.css';

function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: 'How long does it take to build a website?',
            answer: 'Typically, a standard website takes 3-5 days to complete. More complex web applications or mobile apps may take 1-2 weeks depending on the features and scope. We\'ll provide a detailed timeline during our initial consultation.'
        },
        {
            question: 'What is included in the pricing?',
            answer: 'Our pricing includes design, development, testing, and deployment. You\'ll receive a fully functional website or application, along with training on how to manage it. Hosting and domain registration are billed separately, but we can help you set those up.'
        },
        {
            question: 'Do you offer maintenance and support?',
            answer: 'Yes! We offer monthly maintenance packages starting at R2,999/month. This includes security updates, bug fixes, performance monitoring, and regular backups. We also provide priority support for any issues that may arise.'
        },
        {
            question: 'Can you work with my existing website?',
            answer: 'Absolutely. We can redesign, optimize, or add new features to your existing website. We\'ll first assess your current setup and provide recommendations for improvements.'
        },
        {
            question: 'What technologies do you use?',
            answer: 'We use modern, industry-standard technologies including React, Node.js, Python, and Flutter for mobile apps. Our tech stack is chosen based on your specific needs to ensure the best performance, security, and scalability.'
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section className="faq">
            <div className="faq-container">
                <div className="faq-header">
                    <span className="faq-badge">FAQ</span>
                    <h2 className="faq-title">Frequently Asked Questions</h2>
                    <p className="faq-subtitle">
                        Have questions? We've got answers. If you don't find what you're looking for, feel free to contact us.
                    </p>
                </div>
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span>{faq.question}</span>
                                <svg
                                    className="faq-chevron"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQ;
