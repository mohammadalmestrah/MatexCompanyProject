export const responseCategories = {
  help: {
    keywords: ['help', 'can you help', 'need help', 'assist', 'support', 'guidance'],
    responses: [
      "I'd be happy to help! I can assist you with:\n\n• Machine Learning & AI\n• Software Development\n• Mobile Development\n• Web Technologies\n• Cloud Computing\n• Cybersecurity\n• Information about our services\n• Project inquiries\n• Technical solutions\n• Company information\n\nWhat would you like to know more about?",
      "Of course! I'm here to help with anything you need. I can provide information about:\n\n• Machine Learning & AI\n• Software Development\n• Mobile Development\n• Web Technologies\n• Cloud Computing\n• Cybersecurity\n• Our technology solutions\n• Company details\n• Contact information\n\nWhat can I help you with?",
      "I'm here to assist! I can help you with:\n\n• Machine Learning & AI\n• Software Development\n• Mobile Development\n• Web Technologies\n• Cloud Computing\n• Cybersecurity\n• Learning about Matex\n• Understanding our services\n• Technical information\n• Getting in touch\n\nWhat would you like assistance with?"
    ],
    followUp: [
      "Would you like to know about any specific technology?",
      "Shall I tell you more about our expertise?",
      "Would you like to schedule a consultation?"
    ],
    context: "general_help"
  },
  machine_learning: {
    keywords: ['machine learning', 'ml', 'supervised learning', 'unsupervised learning', 'reinforcement learning', 'neural networks', 'deep learning', 'tensorflow', 'pytorch'],
    responses: [
      "Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.\n\nTypes of Machine Learning:\n• Supervised Learning: Learning with labeled training data\n• Unsupervised Learning: Finding hidden patterns without labeled examples\n• Reinforcement Learning: Learning through interaction with environment\n\nPopular Frameworks: TensorFlow, PyTorch, Scikit-learn, Keras, XGBoost",
      "Machine Learning applications include:\n• Predictive Analytics\n• Image Recognition\n• Natural Language Processing\n• Recommendation Systems\n• Fraud Detection\n• Autonomous Vehicles\n• Medical Diagnosis\n\nWe can help you implement ML solutions for your business needs."
    ],
    context: "machine_learning"
  },
  artificial_intelligence: {
    keywords: ['artificial intelligence', 'ai', 'deep learning', 'computer vision', 'natural language processing', 'nlp', 'robotics'],
    responses: [
      "Artificial Intelligence (AI) is the simulation of human intelligence in machines. It encompasses:\n\n• Machine Learning: Algorithms that improve through experience\n• Deep Learning: Neural networks with multiple layers\n• Natural Language Processing (NLP): Understanding human language\n• Computer Vision: Interpreting visual information\n• Robotics: Intelligent machines for physical tasks\n\nTypes of AI:\n• Narrow AI: Designed for specific tasks\n• General AI: Human-level cognitive abilities\n• Superintelligence: Surpassing human intelligence",
      "AI can transform your business through:\n• Automation of repetitive tasks\n• Enhanced decision making\n• Improved customer experiences\n• Predictive analytics\n• Intelligent data processing\n\nWe provide comprehensive AI solutions tailored to your needs."
    ],
    context: "artificial_intelligence"
  },
  software_development: {
    keywords: ['software development', 'programming', 'coding', 'web development', 'frontend', 'backend', 'full stack', 'agile', 'devops'],
    responses: [
      "Software development is the process of creating and maintaining applications, frameworks, and software components.\n\nDevelopment Methodologies:\n• Agile: Iterative approach with collaboration\n• Scrum: Framework within Agile using sprints\n• Waterfall: Sequential approach\n• DevOps: Combining development and operations\n\nProgramming Languages:\n• Web: JavaScript, TypeScript, Python, Java, C#\n• Mobile: Swift, Kotlin, Java, Dart\n• Backend: Python, Java, C#, Node.js, Go\n• Data Science: Python, R, SQL\n\nTypes of Development:\n• Frontend: User interface and experience\n• Backend: Business logic and databases\n• Full-Stack: Combining frontend and backend\n• DevOps: Deployment and operations",
      "We provide comprehensive software development services including:\n• Custom web applications\n• Mobile apps (iOS/Android)\n• Desktop applications\n• API development\n• Database design\n• Cloud integration\n• Maintenance and support"
    ],
    context: "software_development"
  },
  mobile_development: {
    keywords: ['mobile development', 'mobile app', 'ios', 'android', 'react native', 'flutter', 'xamarin', 'ionic'],
    responses: [
      "Mobile development is creating software applications for smartphones and tablets.\n\nDevelopment Platforms:\n• Native Development: Platform-specific using Swift/Objective-C (iOS) or Kotlin/Java (Android)\n• Cross-Platform: Single codebase for multiple platforms using React Native, Flutter, Xamarin\n• Hybrid Development: Web-based apps wrapped in native containers\n\nCross-Platform Frameworks:\n• React Native: Facebook's framework using JavaScript\n• Flutter: Google's framework using Dart\n• Xamarin: Microsoft's framework using C#\n• Ionic: Framework using web technologies\n\nTypes of Mobile Apps:\n• Consumer Apps (Social Media, Entertainment)\n• Business Apps (Productivity, CRM)\n• E-commerce Apps\n• Gaming Apps\n• Educational Apps\n• Healthcare Apps",
      "We develop mobile applications using:\n• Native iOS development with Swift\n• Native Android development with Kotlin\n• Cross-platform solutions with React Native and Flutter\n• Hybrid applications with Ionic\n• Custom mobile solutions for your business needs"
    ],
    context: "mobile_development"
  },
  web_technologies: {
    keywords: ['web development', 'frontend', 'backend', 'react', 'vue', 'angular', 'node.js', 'html', 'css', 'javascript'],
    responses: [
      "Web Development Technologies:\n\nFrontend Frameworks:\n• React: Component-based JavaScript library\n• Vue.js: Progressive JavaScript framework\n• Angular: TypeScript-based framework by Google\n\nBackend Frameworks:\n• Node.js: JavaScript runtime with Express.js, Koa.js\n• Python: Django, Flask, FastAPI\n• Java: Spring Boot, Struts, JSF\n\nDatabases:\n• Relational: MySQL, PostgreSQL, Oracle, SQL Server\n• NoSQL: MongoDB, Cassandra, Redis, CouchDB\n• Cloud: Amazon RDS, Google Cloud SQL, Azure SQL\n\nStyling: CSS3, Sass, Less, Tailwind CSS, Bootstrap",
      "We provide full-stack web development services:\n• Modern frontend applications with React, Vue, or Angular\n• Robust backend systems with Node.js, Python, or Java\n• Database design and optimization\n• API development and integration\n• Responsive and mobile-friendly designs\n• Performance optimization and security"
    ],
    context: "web_technologies"
  },
  cloud_computing: {
    keywords: ['cloud computing', 'aws', 'azure', 'gcp', 'google cloud', 'iaas', 'paas', 'saas', 'cloud migration'],
    responses: [
      "Cloud computing is the delivery of computing services over the Internet.\n\nService Models:\n• Infrastructure as a Service (IaaS): Virtualized computing resources\n• Platform as a Service (PaaS): Development and deployment platforms\n• Software as a Service (SaaS): Software applications on subscription\n\nDeployment Models:\n• Public Cloud\n• Private Cloud\n• Hybrid Cloud\n• Multi-Cloud\n\nMajor Providers:\n• AWS: EC2, S3, Lambda, RDS, DynamoDB\n• Microsoft Azure: Virtual Machines, Blob Storage, Functions\n• Google Cloud: Compute Engine, Cloud Storage, Cloud Functions",
      "Our cloud services include:\n• Cloud migration and setup\n• Infrastructure design and management\n• Security implementation\n• Cost optimization\n• Scalability solutions\n• 24/7 monitoring and support\n• Multi-cloud strategies"
    ],
    context: "cloud_computing"
  },
  cybersecurity: {
    keywords: ['cybersecurity', 'security', 'hacking', 'malware', 'phishing', 'firewall', 'encryption', 'data protection'],
    responses: [
      "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks.\n\nTypes of Threats:\n• Malware\n• Phishing\n• Ransomware\n• SQL Injection\n• Cross-Site Scripting (XSS)\n• DDoS Attacks\n• Social Engineering\n\nSecurity Measures:\n• Firewalls\n• Antivirus Software\n• Encryption\n• Multi-Factor Authentication\n• Regular Security Updates\n• Employee Training\n• Network Monitoring\n• Backup and Recovery",
      "We provide comprehensive cybersecurity services:\n• Security assessment and audits\n• Implementation of security measures\n• Employee training programs\n• Incident response planning\n• Compliance with security standards\n• Ongoing monitoring and support\n• Data protection strategies"
    ],
    context: "cybersecurity"
  },
  escalation: {
    keywords: ['advanced machine learning', 'deep learning architecture', 'neural network optimization', 'custom ai model', 'complex algorithm', 'enterprise solution', 'large scale system', 'security implementation', 'performance optimization', 'advanced analytics', 'blockchain development', 'microservices architecture', 'distributed systems', 'real-time processing', 'high availability', 'disaster recovery', 'compliance requirements', 'integration complexity', 'legacy system migration', 'multi-tenant architecture'],
    responses: [
      "هذه مسألة معقدة وتتطلب خبرة متخصصة. يوجد عميل سوف يتكلم معكم قريباً. سيتم إرسال بريد إلكتروني إلى محمد المستراح على contact@matexsolution.com"
    ],
    context: "escalation"
  }
};