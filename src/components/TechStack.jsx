import './TechStack.css';

import reactIcon from '../assets/react.svg';
import nodeIcon from '../assets/icons/nodeicon.svg';
import pythonIcon from '../assets/icons/pythonicon.png';
import typescriptIcon from '../assets/icons/typescript.svg';
import flutterIcon from '../assets/icons/fluttericon.png';
import nextjsIcon from '../assets/icons/nextjsicon.jpeg';
import swiftIcon from '../assets/icons/swifticon.png';
import phpIcon from '../assets/icons/phpicon.png';

function TechStack() {
    const technologies = [
        { name: 'React', icon: reactIcon },
        { name: 'Node.js', icon: nodeIcon },
        { name: 'Python', icon: pythonIcon },
        { name: 'TypeScript', icon: typescriptIcon },
        { name: 'Flutter', icon: flutterIcon },
        { name: 'Next.js', icon: nextjsIcon },
        { name: 'Swift', icon: swiftIcon },
        { name: 'PHP', icon: phpIcon },
    ];

    return (
        <section className="tech-stack">
            <div className="tech-stack-container">
                <div className="tech-stack-header">
                    <span className="tech-stack-badge">Our Stack</span>
                    <h2 className="tech-stack-title">Technologies We Use</h2>
                    <p className="tech-stack-subtitle">
                        We work with modern technologies to build fast, scalable, and reliable applications
                    </p>
                </div>
                <div className="tech-grid">
                    {technologies.map((tech, index) => (
                        <div key={index} className="tech-item">
                            <div className="tech-icon">
                                <img src={tech.icon} alt={tech.name} />
                            </div>
                            <span className="tech-name">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TechStack;
