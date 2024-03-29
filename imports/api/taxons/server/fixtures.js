import { Meteor } from 'meteor/meteor';
import { Taxons } from '../taxons.js';

var skills = [
  ".NET",
  "A++",
  "AAUS Scientific Diver",
  "Ab Initio",
  "Abacus",
  "AbacusLaw",
  "Abandonment",
  "ABAP",
  "ABAP Web Dynpro",
  "ABAP-OO",
  "Abaqus",
  "Abatement",
  "ABEL",
  "Abelton",
  "Abend-Aid",
  "ABI",
  "Abis",
  "Ableton Live",
  "ABO Certified",
  "Aboriginal Affairs",
  "Aboriginal Health",
  "Aboriginal Law",
  "Aboriginal Relations",
  "Above the Line",
  "ABR",
  "ABS",
  "Abstract Paintings",
  "Abstracting",
  "Abstraction",
  "Academia",
  "Academic Achievement",
  "Academic Administration",
  "Academic Advising",
  "Academic Background",
  "Academic Consulting",
  "Academic Databases",
  "Academic Development",
  "Academic Editing",
  "Academic English",
  "Academic Journals",
  "Academic Libraries",
  "Academic Medical Centers",
  "Academic Medicine",
  "Academic Program Development",
  "Academic Program Management",
  "Academic Publishing",
  "Academic Research",
  "Academic Support Services",
  "Academic Tutoring",
  "Academic Writing",
  "Access",
  "Access Control",
  "Account Management",
  "Account Reconciliation",
  "Accounting",
  "Accounts Payable",
  "Accounts Receivable",
  "Acting",
  "Active Directory",
  "Acute Care",
  "Administration",
  "Administrative Assistance",
  "Administrative Law",
  "Adobe Acrobat",
  "Adobe Creative Suite",
  "Adolescents",
  "Adult Education",
  "Advertising",
  "Aerial Cinematography",
  "Aerial Lifts",
  "Aerial Photography",
  "Aerial Silks",
  "Aerobics",
  "Aerodynamics",
  "Aeroelasticity",
  "Aerohive",
  "Aeronautics",
  "Aerospace Engineering",
  "Aerospace Industries",
  "Aerospace Manufacturing",
  "Aerospace Medicine",
  "Aerospace Structures",
  "Aerospace",
  "AES",
  "Aesthetic Surgery",
  "Aesthetics",
  "Affiliate Management",
  "Affiliate Marketing",
  "Affiliate Networks",
  "Affirmative Action",
  "Affordable Housing",
  "Afghanistan",
  "After Effects",
  "Aftersales",
  "Agarose Gel Electrophoresis",
  "Agents",
  "Agile & Waterfall Methodologies",
  "Agile Application Development",
  "Agile Methodologies",
  "Agile Project Management",
  "Agile Testing",
  "Agilent ADS",
  "Agribusiness",
  "Agriculture",
  "Agrochemicals",
  "Agronomy",
  "Air Compressors",
  "Air Conditioning",
  "Air Force",
  "Air Freight",
  "Air Quality",
  "Air Traffic Control",
  "Aircraft Design",
  "Aircraft Maintenance",
  "Aircraft Systems",
  "Aircraft",
  "Airframe",
  "Airline Management",
  "Airlines",
  "Airport Management",
  "Airports",
  "Airworthiness",
  "AJAX Frameworks",
  "AJAX Toolkit",
  "AJAX",
  "Akamai",
  "Akka",
  "Alarm Systems",
  "Alcohol Awareness",
  "Alcoholic Beverages",
  "Algebra",
  "Algorithm Design",
  "Algorithms",
  "Allen-Bradley",
  "Allergy",
  "ALM",
  "Alternative Dispute Resolution",
  "Alternative Energy",
  "Alternative Investments",
  "Alternative Medicine",
  "Altium Designer",
  "Aluminum",
  "Alumni Relations",
  "Amadeus GDS",
  "Amadeus",
  "Amazon EBS",
  "Amazon EC2",
  "Amazon S3",
  "Amazon Web Services (AWS)",
  "AMBA AHB",
  "Ambulance",
  "Ambulatory Care",
  "Ambulatory",
  "American English",
  "American History",
  "American Literature",
  "American Politics",
  "American Sign Language",
  "American Welding Society (AWS)",
  "Americans with Disabilities Act",
  "AMI",
  "AMSI",
  "Analysis",
  "Analytics",
  "Android",
  "Animal Behavior",
  "Animation",
  "AOC",
  "AOP",
  "AP Style",
  "Apache",
  "Apartments",
  "Apparel",
  "Appeals",
  "Applicant Tracking Systems",
  "Application Architecture",
  "Applied Behavior Analysis",
  "Applied Mathematics",
  "Appointment Scheduling",
  "Appraisals",
  "APQP",
  "AQL",
  "AQTF compliance",
  "Aquaculture",
  "Aqualogic",
  "Aquaponics",
  "Aquariums",
  "Aquatic Ecology",
  "Aquatic Therapy",
  "Aquatic Toxicology",
  "Aquatics",
  "Aquatint",
  "Aquifer Testing",
  "Aquisition",
  "Arbitration",
  "ArcGIS",
  "Architectural Design",
  "Architectural Drawings",
  "Architecture",
  "Art Direction",
  "Art Education",
  "Art Exhibitions",
  "Art History",
  "Art",
  "Artistic Abilities",
  "Artistic Eye",
  "ASIC",
  "ASP.NET",
  "ASP.NET AJAX",
  "ASP.NET MVC",
  "ASP",
  "Asset Allocation",
  "Asset Management",
  "Asset Protection",
  "Assurance",
  "At Multitasking",
  "At-risk",
  "Athlete Development",
  "Athletic Administration",
  "Athletic Performance",
  "Athletic Training",
  "Athletics",
  "ATM Networks",
  "Atmel AVR",
  "Atomic Absorption",
  "Attendance Management",
  "Attorneys",
  "Audio Editing",
  "Audio Engineering",
  "Auditing",
  "AutoCAD",
  "AutoCAD Architecture",
  "Autodesk Inventor",
  "Automation",
  "Automobile",
  "Automotive Aftermarket",
  "Automotive Engineering",
  "Automotive",
  "AV Integration",
  "AV",
  "Avaya AES",
  "Avaya Communication Manager",
  "Avaya IP Telephony",
  "Avaya Technologies",
  "Aviation Security",
  "Aviation",
  "Avid Media Composer",
  "Avid Newscutter",
  "Avid",
  "Avionics",
  "Award Ceremonies",
  "Award Submissions",
  "Award Winner",
  "Awareness Raising",
  "Awesomeness",
  "Awk",
  "AWR Microwave Office",
  "AWS CWI",
  "AX 2009",
  "AXE",
  "AXI",
  "Axioma",
  "Axis",
  "Axis2",
  "Axles",
  "Axure RP",
  "Axys",
  "Ayurveda",
  "Azerbaijani",
  "B2B",
  "Baan ERP",
  "Back Office",
  "Background Checks",
  "Bands",
  "Bank Reconciliation",
  "Banking",
  "Bankruptcy",
  "Banners",
  "Banquets",
  "Bartending",
  "Bash",
  "Bathrooms",
  "BBEdit",
  "BBP",
  "BBQ",
  "BBx",
  "BCA Protein Assay",
  "BDC programming",
  "BDD",
  "Beauty Industry",
  "Beer",
  "Behavior Based Safety",
  "Behavior Management",
  "Behavioral Health",
  "Benefits Administration",
  "Benefits Negotiation",
  "Beverage Industry",
  "Bhangra",
  "Biblical Studies",
  "Big 4",
  "Big Box",
  "Big Data",
  "Billing Systems",
  "BIM",
  "Biochemistry",
  "Biodiversity",
  "Bioinformatics",
  "Biology",
  "Biomedical Engineering",
  "Biopharmaceuticals",
  "Biostatistics",
  "Biotechnology",
  "Black Box Testing",
  "Blackberry",
  "Blackberry Enterprise Server",
  "Blended Learning",
  "Blender",
  "Blog Marketing",
  "Blogger",
  "Blogging",
  "Blood Pressure",
  "Bloomberg",
  "Bloomberg Terminal",
  "Blueprint Reading",
  "Blues",
  "Bluetooth",
  "BMC Patrol",
  "BMC Portal",
  "BMC Remedy",
  "BMC Remedy Administration",
  "BMC Remedy AR System",
  "BMC Remedy Ticketing System",
  "BMC Remedy User",
  "BMX",
  "Board Certified",
  "Board Development",
  "Board of Directors",
  "Boat",
  "Boating",
  "Bodywork",
  "Boilers",
  "Bonds",
  "Book Design",
  "Book Reviews",
  "Bookkeeping",
  "Bootstrap",
  "Botany",
  "Branch Banking",
  "Brand Ambassadorship",
  "Brand Architecture",
  "Brand Awareness",
  "Brand Development",
  "Brand Equity",
  "Brand Management",
  "Branding",
  "Branding & Identity",
  "Breaking News",
  "Bridge",
  "Broadband",
  "Broadcast",
  "Broadcast Journalism",
  "Broadcast Television",
  "Brochures",
  "Brokerage",
  "Brokers",
  "BTS Installation",
  "Budgeting",
  "Budgets",
  "Building Effective Relationships",
  "Business Alliances",
  "Business Analysis",
  "Business Aviation",
  "Business Development",
  "Business Efficiency",
  "Business Ethics",
  "Business Intelligence",
  "Business Planning",
  "Business Process",
  "Business Process Improvement",
  "Business Strategy",
  "Business Transformation",
  "Buyer Representation",
  "Buyer's Agent",
  "Buyers",
  "Bylined Articles",
  "C",
  "C#",
  "C++",
  "Capacity Building",
  "Capital Equipment",
  "Capital Equipment Sales",
  "Carriage of Goods by Sea",
  "Carrier Ethernet",
  "Cell Biology",
  "Central Europe",
  "Certified EKG Technician",
  "Change Management",
  "Church Events",
  "Civil Aviation",
  "Civil Engineering",
  "Civil Litigation",
  "Client Aquisition",
  "Clinical Research",
  "Closing Abilities",
  "Coaching",
  "Commercial Aviation",
  "Commercial Awareness",
  "Commercial Banking",
  "Commercial Real Estate",
  "Communication",
  "Community Outreach",
  "Compensation & Benefits",
  "Competitive Analysis",
  "Computer Hardware",
  "Conceptual Ability",
  "Construction",
  "Construction Management",
  "Consumer Behaviour",
  "Consumer Electronics",
  "Contemporary Art",
  "Continuous Improvement",
  "Contract Management",
  "Contract Negotiation",
  "Contractual Agreements",
  "Copy Editing",
  "Core Banking",
  "Core Java",
  "Corporate Branding",
  "Corporate Events",
  "Corporate Finance",
  "Corporate Governance",
  "Corporate Law",
  "Corporate Real Estate",
  "Cost Accounting",
  "Cost Benefit",
  "Cost Efficiency",
  "Creative Writing",
  "Credit Analysis",
  "Criminal Justice",
  "CRM",
  "Cross-border Transactions",
  "Cross-functional Team Leadership",
  "CSS",
  "Cultural Awareness",
  "Current Affairs",
  "Curriculum Design",
  "Curriculum Development",
  "Customer Experience",
  "Customer Satisfaction",
  "Customer Service",
  "Czech",
  "D",
  "Data Analysis",
  "Data Entry",
  "Database Administration",
  "Databases",
  "Design of Experiments",
  "Development Economics",
  "Digital Electronics",
  "Digital Marketing",
  "Digital Media",
  "Direct Sales",
  "Drafting Agreements",
  "Driven By Results",
  "Dry Eye",
  "E-commerce",
  "E-Learning",
  "Eagle PCB",
  "Eaglesoft",
  "EAI",
  "Early Childhood Development",
  "Early Childhood Education",
  "Early Childhood Literacy",
  "Early Intervention",
  "Early-stage Startups",
  "Earned Value Management",
  "Earth Science",
  "Earthquake Engineering",
  "Earthworks",
  "EASA",
  "Easements",
  "Easily Adaptable",
  "Eastern Europe",
  "Easytrieve",
  "EBA",
  "eBanking",
  "eBay",
  "eBay API",
  "Ebay Sales",
  "Ebooks",
  "eBusiness Suite",
  "ECDL Certification",
  "Eclipse",
  "Ecological Restoration",
  "Ecology",
  "Econometric Modeling",
  "Econometrics",
  "Economic Development",
  "Economic Modeling",
  "Economic Policy",
  "Economic Research",
  "Economics",
  "Ecotect",
  "Editing",
  "Editorial",
  "Education",
  "Educational Leadership",
  "Educational Technology",
  "EEO",
  "EEO Compliance",
  "EEO Investigations",
  "EEO Reporting",
  "EEO/AA Compliance",
  "EFQM Excellence Model",
  "eGain",
  "eGaming",
  "eGate",
  "Eggplant",
  "Egyptian Arabic",
  "Egyptology",
  "EH&S Compliance",
  "Ehcache",
  "eHealth",
  "Ektron",
  "Ektron Content Management System",
  "Elder Care",
  "Electric Power",
  "Electrical Controls",
  "Electrical Design",
  "Electrical Engineering",
  "Electrical Troubleshooting",
  "Electricians",
  "Electricity",
  "Electronic Payments",
  "Electronic Trading",
  "Electronic Warfare",
  "Electronics",
  "Elementary Education",
  "Email Marketing",
  "Embedded C",
  "Embedded Linux",
  "Embedded Software",
  "Embedded Systems",
  "Emergency Management",
  "Emergency Medicine",
  "Emergency Room",
  "Emergency Services",
  "Emerging Markets",
  "Emotional Intelligence",
  "Employee Benefits",
  "Employee Engagement",
  "Employee Management",
  "Employee Relations",
  "Employee Training",
  "Employer Branding",
  "Employment Law",
  "Energy",
  "Energy Efficiency",
  "Engineering",
  "Engineering Management",
  "English",
  "Enterprise Architecture",
  "Enterprise Software",
  "Entertainment",
  "Entrepreneurship",
  "Environmental Awareness",
  "Environmental Impact Assessment",
  "Epi Info",
  "Epic Systems",
  "Epicor",
  "Epidemiology",
  "Epigenetics",
  "EPiServer",
  "Epistemology",
  "Eplan",
  "ePolicy Orchestrator",
  "Epoxy",
  "Epoxy Flooring",
  "EPR",
  "ePub",
  "Equality & Diversity",
  "Equestrian",
  "Equipment Installation",
  "Equipment Maintenance",
  "Equities",
  "Equity Derivatives",
  "Equity Research",
  "Equity Trading",
  "Equity Valuation",
  "Ergonomics",
  "Ericsson OSS",
  "Erlang",
  "Erosion",
  "Erosion Control",
  "ERP",
  "ERP Implementations",
  "ERP Software",
  "Erwin",
  "Essbase",
  "Estate Administration",
  "Estate Planning",
  "Estimates",
  "Ethernet",
  "Ethical Decision Making",
  "Ethical Hacking",
  "Ethics",
  "Ethnography",
  "ETL",
  "ETL Tools",
  "eTOM",
  "EU Competition Law",
  "EU Funding",
  "EU Law",
  "Euphonium",
  "Euroclear",
  "Eurocodes",
  "European Affairs",
  "European Computer Driving Licence",
  "European History",
  "European Integration",
  "European Languages",
  "European Law",
  "European Markets",
  "European Politics",
  "European Studies",
  "European Union",
  "European Union Politics",
  "Euthanasia",
  "Evangelism",
  "Event Management",
  "Event Photography",
  "Event Planning",
  "Event Production",
  "Events Coordination",
  "Events Organisation",
  "Evidence",
  "EViews",
  "Executive Administrative Assistance",
  "Executive Coaching",
  "Executive Management",
  "Executive Protection",
  "Executive Search",
  "Exercise Physiology",
  "Experimentation",
  "Export",
  "External Audit",
  "Eye Exams",
  "Eye Surgery",
  "Eye Tracking",
  "Eye Treatments",
  "Eyebrow",
  "Eyelash & Eyebrow Tinting",
  "Eyelash Extensions",
  "Eyelid Surgery",
  "Eyeliner",
  "Eyeon Fusion",
  "Eyewear",
  "F",
  "F#",
  "Facebook",
  "Fashion",
  "Fashion Blogging",
  "Feature Articles",
  "Film",
  "Finance",
  "Financial Accounting",
  "Financial Advisory",
  "Financial Analysis",
  "Financial Audits",
  "Financial Modeling",
  "Financial Planning",
  "Financial Reporting",
  "Financial Risk",
  "Financial Services",
  "Fine Art",
  "Finite Element Analysis",
  "Fire Alarm",
  "First Aid",
  "First Time Home Buyers",
  "Fixed Assets",
  "Flame AA",
  "Food",
  "Food & Beverage",
  "Food Quality",
  "For Sale By Owner",
  "Forecasting",
  "Foreign Affairs",
  "Formation Evaluation",
  "French",
  "Fundraising",
  "G++",
  "Gas",
  "Gel Electrophoresis",
  "General Aviation",
  "General Insurance",
  "General Ledger",
  "GGY Axis",
  "GIS",
  "Git",
  "GMP",
  "Google Adwords",
  "Google Analytics",
  "Google Apps",
  "Google Earth",
  "Governance",
  "Government",
  "Governmental Affairs",
  "Grant Writing",
  "Grants",
  "Graphic Design",
  "Graphics",
  "Green Belt",
  "Green Building",
  "GSM",
  "Hatha Yoga",
  "Health Economics",
  "Health Education",
  "Healthcare",
  "Healthcare Information Technology",
  "Healthcare Management",
  "Healthy Eating",
  "Heavy Equipment",
  "High Availability Clustering",
  "High Availability",
  "Higher Education",
  "Home Equity Lines of Credit",
  "Home Equity Loans",
  "Home Health Agencies",
  "Hospitality",
  "Hospitality Industry",
  "Hospitality Management",
  "Hospitals",
  "Hotel Booking",
  "Hotels",
  "HTML",
  "HTML5",
  "Human Resources",
  "Hyperion EPM",
  "Illustrator",
  "Image Editing",
  "InDesign",
  "Indoor Air Quality",
  "Industrial Ethernet",
  "Information Architecture",
  "Information Assurance",
  "Information Security Awareness",
  "Inspection",
  "Insurance",
  "Integrated Marketing",
  "Integration",
  "Intercollegiate Athletics",
  "Intercultural Awareness",
  "Interior Architecture",
  "Internal Audit",
  "Internal Controls",
  "International Business",
  "International Economics",
  "International Political Economy",
  "International Real Estate",
  "Internet Banking",
  "Interviews",
  "Inventory Management",
  "Investment Banking",
  "Investment Properties",
  "Investments",
  "IT Audit",
  "IT Management",
  "IT Service Management",
  "IT Strategy",
  "J#",
  "Java",
  "Java Enterprise Edition",
  "JavaScript",
  "JBoss Application Server",
  "JIRA",
  "Job Descriptions",
  "Job Evaluation",
  "Joint Ventures",
  "Joomla",
  "Journal Entries",
  "Journalism",
  "jQuery",
  "JSON",
  "JSP",
  "JUnit",
  "Kanban",
  "Key Account Development",
  "Key Account Management",
  "Key Performance Indicators",
  "Keyboards",
  "Keynote",
  "Keyword Research",
  "Kinesiology",
  "Kitchen & Bath Design",
  "Knitwear",
  "Knowledge Management",
  "KPI Implementation",
  "KPI Reports",
  "Kronos",
  "Laboratory Equipment",
  "Latin America",
  "Latin American Studies",
  "Lead Generation",
  "Leadership",
  "Leadership Development",
  "Lean Manufacturing",
  "Leave of Absence",
  "LEED AP",
  "Legal Advice",
  "Legal Assistance",
  "Legal Research",
  "Legal Writing",
  "Legislative Affairs",
  "Life Sciences",
  "Linux",
  "Linux Kernel",
  "Litigation",
  "Live Events",
  "Loans",
  "Logistics",
  "Logistics Management",
  "Logo Design",
  "Mac OS X Server",
  "Management",
  "Management by Objectives",
  "Management Consulting",
  "Manufacturing",
  "Marine Biology",
  "Market Analysis",
  "Market Research",
  "Marketing",
  "Marketing Communications",
  "Marketing Strategy",
  "Mechanical Engineering",
  "Media Relations",
  "Medical Affairs",
  "Medical Billing",
  "Medical Education",
  "Mental Health",
  "Mergers & Acquisitions",
  "Metro Ethernet",
  "Microsoft Dynamics AX",
  "Microsoft Dynamics ERP",
  "Microsoft Excel",
  "Microsoft Exchange",
  "Microsoft Office",
  "Microsoft Project",
  "Microsoft SQL Server",
  "Microsoft Word",
  "Middle Eastern Studies",
  "Military Affairs",
  "Military Aviation",
  "Military Experience",
  "Military Operations",
  "Mineral Exploration",
  "Mixed-use",
  "Mobile Applications",
  "Molecular Biology",
  "Mood Boards",
  "Mortgage Banking",
  "MS Axapta",
  "Music Education",
  "N+",
  "National Security",
  "Negotiation",
  "Network Administration",
  "Network Design",
  "Network Security",
  "Networking",
  "New Business Development",
  "New Home Sales",
  "New Media",
  "News Writing",
  "Newsletters",
  "Newspapers",
  "Node.js",
  "Non-compete Agreements",
  "Nonprofits",
  "Numerical Ability",
  "Nursing",
  "Nursing Education",
  "Nutrition",
  "Office Administration",
  "Office Equipment",
  "Office Management",
  "Oil & Gas",
  "Onboarding",
  "Online Advertising",
  "Online Journalism",
  "Online Marketing",
  "Onshore",
  "Operating Systems",
  "Operational Efficiency",
  "Operational Excellence",
  "Operational Planning",
  "Operations Management",
  "Oracle",
  "Oracle Applications",
  "Oracle BPEL",
  "Oracle BPM",
  "Oracle ERP",
  "Organizational Behavior",
  "Organizational Development",
  "Organizational Effectiveness",
  "OS X",
  "Outlook",
  "Outsourcing",
  "P&L Management",
  "Particle Effects",
  "Passionate about work",
  "Patient Education",
  "Payment by Results",
  "Penalty Abatement",
  "Performance Appraisal",
  "Performance Management",
  "Performing Arts",
  "Pharmaceutical Industry",
  "Pharmacy Benefit Management",
  "Phone Etiquette",
  "Photography",
  "Photoshop",
  "Play by Play",
  "Play-by-play",
  "PLC Allen Bradley",
  "Poka Yoke",
  "Policy",
  "Policy Analysis",
  "Political Economy",
  "Powder X-ray Diffraction",
  "Power Electronics",
  "Power Generation",
  "PowerPoint",
  "Powers of Attorney",
  "Prenuptial Agreements",
  "Press Releases",
  "Private Banking",
  "Private Equity",
  "Private Events",
  "Process Automation",
  "Process Efficiency",
  "Process Engineering",
  "Process Improvement",
  "Procurement",
  "Product Development",
  "Product Knowledge",
  "Product Management",
  "Production Efficiency",
  "Professional Ethics",
  "Program Development",
  "Program Evaluation",
  "Program Management",
  "Project Bidding",
  "Project Engineering",
  "Project Estimation",
  "Project Management",
  "Project Planning",
  "Proposal Writing",
  "Protein Expression",
  "Psychological Assessment",
  "Public Administration",
  "Public Affairs",
  "Public Health",
  "Public Relations",
  "Public Speaking",
  "Purchasing",
  "Qualitative Research",
  "Quality Assurance",
  "Quality Auditing",
  "Quality by Design",
  "Quality Control",
  "Quality Improvement",
  "Quality Management",
  "Quality System",
  "Quantitative Analytics",
  "Quantitative Research",
  "Quantity Surveying",
  "QuarkXPress",
  "QuickBooks",
  "R",
  "R&D",
  "R&R",
  "Radio Broadcasting",
  "Real Estate",
  "Real Estate Development",
  "Real Estate Economics",
  "Real Estate Financing",
  "Real Estate License",
  "Real Estate Marketing",
  "Real Estate Transactions",
  "Recognition Awards",
  "Recruiting",
  "Recruitment Advertising",
  "Registered Patent Attorney",
  "Regulatory Affairs",
  "Relationship Building",
  "Renewable Energy",
  "Requirements Analysis",
  "Requirements Gathering",
  "Research",
  "Research Ethics",
  "Residential Homes",
  "Retail",
  "Retail Banking",
  "Revenue Analysis",
  "Risk Assessment",
  "Risk Management",
  "Root Cause Analysis",
  "Rotating Equipment",
  "Sage 300 ERP",
  "Sage ERP X3",
  "Sales",
  "Sales Effectiveness",
  "Sales Management",
  "Sales Operations",
  "SAP",
  "SAP BI",
  "SAP BPC",
  "SAP BPM",
  "SAP Business ByDesign",
  "SAP BW",
  "SAP EBP",
  "SAP ERP",
  "SAP EWM",
  "SAP XI",
  "Sarbanes-Oxley Act",
  "Scanning Electron Microscopy",
  "Security Audits",
  "Security Awareness",
  "Self-esteem",
  "Sensory Evaluation",
  "Sickness Absence Management",
  "Situational Awareness",
  "Small Business",
  "SOA BPEL",
  "Social Media",
  "Social Media Blogging",
  "Social Media Marketing",
  "Social Networking",
  "Software Development",
  "Software Engineering",
  "Software Quality Assurance",
  "Solution Architecture",
  "Spanish",
  "Special Education",
  "Special Effects",
  "Special Effects Makeup",
  "Special Events",
  "Special Events Coordination",
  "Sports Play-by-play",
  "SQL",
  "SQL Azure",
  "Staff Development",
  "Start-ups",
  "Strategic Alliances",
  "Strategic Planning",
  "Strategy",
  "Student Affairs",
  "Student Financial Aid",
  "Study Abroad Programs",
  "Sub-Saharan Africa",
  "Substance Abuse Prevention",
  "Supplier Evaluation",
  "Supplier Quality",
  "Supply Chain Management",
  "Sustainable Agriculture",
  "System Administration",
  "System Architecture",
  "Systems Analysis",
  "Systems Engineering",
  "Talent Acquisition",
  "Talent Booking",
  "Talent Management",
  "Tally ERP",
  "Tax",
  "Teaching",
  "Team Building",
  "Team Effectiveness",
  "Team Leadership",
  "Team Management",
  "Teamwork",
  "Technical Ability",
  "Technical Support",
  "Technical Writing",
  "Telecom BSS",
  "Telecommunications",
  "Television",
  "Tenacious Work Ethic",
  "Test Automation",
  "Test Equipment",
  "Testing",
  "Thomson Reuters Eikon",
  "Time & Attendance",
  "Time Management",
  "Time-efficient",
  "Training",
  "Transportation",
  "Travel Agency",
  "Trend Analysis",
  "Troubleshooting",
  "Tutoring",
  "Ubuntu",
  "Umbrella Insurance",
  "UML",
  "UMTS",
  "Underwriting",
  "Unified Communications",
  "Union Avoidance",
  "University Teaching",
  "Unix",
  "Upstream",
  "Urban Design",
  "Urban Planning",
  "Usability",
  "User Acceptance Testing",
  "User Experience",
  "User Experience Design",
  "User Interface",
  "User Interface Design",
  "V+",
  "Validation",
  "Valuation",
  "Value Engineering",
  "Variance Analysis",
  "Vehicles",
  "Vendor Management",
  "Video",
  "Video Editing",
  "Video Production",
  "Virtualization",
  "Visio",
  "Visual Arts",
  "Visual Basic",
  "Visual Effects",
  "Visual Merchandising",
  "Visual Studio",
  "VMware",
  "VMware ESX",
  "VoIP",
  "Volunteer Management",
  "VPN",
  "Vulnerability Assessment",
  "Warehousing",
  "Water Quality",
  "Web Analytics",
  "Web Applications",
  "Web Design",
  "Web Development",
  "Web Services",
  "WebSphere Application Server",
  "Wellness",
  "Western Blotting",
  "Windows",
  "Windows 7",
  "Windows Azure",
  "Windows Server",
  "Windows XP",
  "Wireless",
  "WordPress",
  "Work Effectively",
  "Working Abroad",
  "Working at Height",
  "Workshop Facilitation",
  "Writing",
  "X-ray",
  "X++",
  "x86 Assembly",
  "XAML",
  "Xbox 360",
  "Xcode",
  "Xen",
  "XHTML",
  "Xilinx",
  "Xilinx ISE",
  "XML",
  "XML Schema",
  "XPath",
  "XSL",
  "XSLT",
  "Yachting",
  "Yardi",
  "Year End Accounts",
  "Year-end Close",
  "Yield",
  "Yield Management",
  "Yii",
  "Yoga",
  "Young Adults",
  "Youth At Risk",
  "Youth Development",
  "Youth Empowerment",
  "Youth Engagement",
  "Youth Leadership",
  "Youth Mentoring",
  "Youth Ministry",
  "Youth Programs",
  "Youth Work",
  "YouTube"
];

Meteor.startup(function () {
  var taxonsCount = Taxons.find({}).count();
  if (taxonsCount == 0) {
    for (let i = 0; i < skills.length; i++) {
      let skill = skills[i];
      Taxons.insert({
        verified: true,
        name: skill,
        type: 'skill',
        i18n: {
          zh: { name: '' },
          fr: { name: '' }
        }
      });
    }
  }
});

/**
 * @description
 * Execute a list of Promise return functions in series
 *
 * @param {Array} list - A list of functions returning Promises in series
 **/
function pseries(list) {
  var p = Promise.resolve();
  return list.reduce(function(pacc, fn) {
    return pacc = pacc.then(fn);
  }, p);
}

/**
 * Generate an array of letters between charA and charZ included
 */
function genCharArray(charA, charZ, startWith = '') {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(startWith+String.fromCharCode(i));
    }
    return a;
}

/**
 * Call the linkedin query url to get the suggestion for the given string
 * @param {String} query
 * @return {Array} suggestions - An array of the returned suggestions labels
 */
function getSuggestions (query) {
  return new Promise(function (resolve, reject) {
    $.get( "https://www.linkedin.com/ta/skill?query="+query)
      .done(function(data) {
        // Put the suggestions in the array
        for(var i = 0; i < data.resultList.length; i++) {
          suggArray.push(data.resultList[i].displayName);
        }
        // If they was results
        if (data.resultList.length) {
          // Recursivly get new suggestions until there is no one more
          var newQueryStrings = genCharArray('a', 'z', query);

          for (let y = 0; y < newQueryStrings.length; y++) {
            let fnList = [];
            let newStr = newQueryStrings[y];
            fnList.push(function() {
              // Get the linkedin results
              return getSuggestions(newStr);
            });
            // Execute the Promises in Series
            resolve( pseries(fnList) );
          }
        }
        else {
          resolve();
        }
      });
  });
}

function getAllSuggestions () {
  // Get all the alphabet in an array
  //var alphabet = genCharArray('a', 'z');
  // [f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  var alphabet = ['d'];

  // For each letter in the alphabet
  for (var i = 0; i < alphabet.length; i++) {
    let fnList = [];
    let query = alphabet[i];
    fnList.push(function() {
      // Get the linkedin results
      return getSuggestions(query);
    });
    // Execute the Promises in Series
    return pseries(fnList);
  }
}

/*var suggArray = [];
getAllSuggestions()
.then(function(res) {
  console.log('Has ended');
  var csvContent = "data:text/csv;charset=utf-8,";
  suggArray.forEach(function(infoArray, index){
     dataString = infoArray;
     csvContent += index < suggArray.length ? dataString+ "\n" : dataString;
  });
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "suggestions_d.csv");

  link.click();
});
*/
