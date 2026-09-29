from typing import List, Dict, Any

MOCK_ASSETS: List[Dict[str, Any]] = [
    {
        "id": "1",
        "name": "Active Directory Domain Controller",
        "category": "Identity & Access Management",
        "cvss_score": 8.9,
        "business_value": 15000000.0,
        "threat_frequency": 7.2,
        "owner": "IT SecOps",
        "criticality": "Tier 1 - Mission Critical",
        "description": "Central authentication and authorization hub for enterprise accounts."
    },
    {
        "id": "2",
        "name": "Core Banking Cloud DB",
        "category": "Database & Cloud Infrastructure",
        "cvss_score": 9.2,
        "business_value": 12500000.0,
        "threat_frequency": 6.5,
        "owner": "Data Engineering",
        "criticality": "Tier 1 - Mission Critical",
        "description": "Multi-region distributed PostgreSQL database hosting transaction logs."
    },
    {
        "id": "3",
        "name": "Customer Payment Gateway",
        "category": "Financial Services API",
        "cvss_score": 8.8,
        "business_value": 9800000.0,
        "threat_frequency": 8.0,
        "owner": "FinTech Ops",
        "criticality": "Tier 1 - Mission Critical",
        "description": "PCI-DSS compliant payment processing and settlement microservice."
    },
    {
        "id": "4",
        "name": "Customer PII Data Lake",
        "category": "Cloud Storage & Analytics",
        "cvss_score": 8.1,
        "business_value": 8200000.0,
        "threat_frequency": 4.8,
        "owner": "Data Governance",
        "criticality": "Tier 1 - High",
        "description": "Central warehouse storing 2.5M customer identities and analytics records."
    },
    {
        "id": "5",
        "name": "DevOps CI/CD Production Cluster",
        "category": "Infrastructure & Build",
        "cvss_score": 7.9,
        "business_value": 5400000.0,
        "threat_frequency": 5.5,
        "owner": "Platform Engineering",
        "criticality": "Tier 2 - High",
        "description": "Kubernetes production build agents and deployment secret runners."
    },
    {
        "id": "6",
        "name": "Enterprise HR & Payroll Portal",
        "category": "Internal Web Applications",
        "cvss_score": 7.4,
        "business_value": 4200000.0,
        "threat_frequency": 3.5,
        "owner": "People Operations",
        "criticality": "Tier 2 - Medium",
        "description": "Workforce compensation, direct deposit, and confidential employee records."
    },
    {
        "id": "7",
        "name": "Zero Trust Executive VPN Gateway",
        "category": "Network & Perimeter",
        "cvss_score": 7.1,
        "business_value": 3900000.0,
        "threat_frequency": 4.0,
        "owner": "Network Engineering",
        "criticality": "Tier 2 - Medium",
        "description": "Secure remote tunneling portal for distributed leadership and admins."
    },
    {
        "id": "8",
        "name": "Internal ERP Supply Chain API",
        "category": "Microservices & Logistics",
        "cvss_score": 6.8,
        "business_value": 3600000.0,
        "threat_frequency": 3.0,
        "owner": "Supply Chain Tech",
        "criticality": "Tier 3 - Medium",
        "description": "Vendor procurement and inventory fulfillment synchronization interface."
    },
    {
        "id": "9",
        "name": "Corporate Email & Exchange Server",
        "category": "Enterprise Communications",
        "cvss_score": 6.2,
        "business_value": 2800000.0,
        "threat_frequency": 5.0,
        "owner": "SysAdmin Group",
        "criticality": "Tier 3 - Medium",
        "description": "Exchange and webmail infrastructure with corporate anti-phishing filters."
    },
    {
        "id": "10",
        "name": "Public Marketing Web App",
        "category": "Public-Facing Web",
        "cvss_score": 4.5,
        "business_value": 850000.0,
        "threat_frequency": 2.5,
        "owner": "Growth Marketing",
        "criticality": "Tier 4 - Low",
        "description": "Static JAMstack corporate brochure and blog marketing site."
    }
]
