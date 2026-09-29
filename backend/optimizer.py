from typing import List, Dict, Any
from copy import deepcopy

# Curated security intervention catalog for enterprise IT assets
SECURITY_INTERVENTIONS = [
    {
        "id": "INT-01",
        "asset_id": "1",
        "asset_name": "Active Directory Domain Controller",
        "title": "Zero-Trust Tiering & Privileged Access Management (PAM)",
        "cost": 1800000.0,  # ₹18 Lakhs
        "cvss_reduction": 2.4,
        "threat_frequency_reduction_pct": 55.0,
        "implementation_days": 21,
        "ai_rationale": "Neutralizes Kerberoasting and lateral movement across identity forests, reducing domain compromise probability by 55%."
    },
    {
        "id": "INT-02",
        "asset_id": "2",
        "asset_name": "Core Banking Cloud DB",
        "title": "Hardware Security Module (HSM) KMS & DB Activity Monitoring",
        "cost": 2200000.0,  # ₹22 Lakhs
        "cvss_reduction": 2.8,
        "threat_frequency_reduction_pct": 60.0,
        "implementation_days": 30,
        "ai_rationale": "Prevents unauthorized database exfiltration and satisfies RBI / PCI-DSS cryptographic mandates for financial records."
    },
    {
        "id": "INT-03",
        "asset_id": "3",
        "asset_name": "Customer Payment Gateway",
        "title": "AI WAF Layer & Tokenization Sandbox",
        "cost": 1500000.0,  # ₹15 Lakhs
        "cvss_reduction": 2.2,
        "threat_frequency_reduction_pct": 50.0,
        "implementation_days": 14,
        "ai_rationale": "Thwarts automated credential stuffing and API parameter manipulation on checkout microservices."
    },
    {
        "id": "INT-04",
        "asset_id": "4",
        "asset_name": "Customer PII Data Lake",
        "title": "Automated DLP & Object-Level Identity Boundaries",
        "cost": 1200000.0,  # ₹12 Lakhs
        "cvss_reduction": 1.9,
        "threat_frequency_reduction_pct": 45.0,
        "implementation_days": 18,
        "ai_rationale": "Mitigates large-scale data exfiltration risks and potential DPDP Act regulatory penalties."
    },
    {
        "id": "INT-05",
        "asset_id": "5",
        "asset_name": "DevOps CI/CD Production Cluster",
        "title": "Software Bill of Materials (SBOM) & Ephemeral Runner Isolation",
        "cost": 800000.0,  # ₹8 Lakhs
        "cvss_reduction": 2.0,
        "threat_frequency_reduction_pct": 40.0,
        "implementation_days": 10,
        "ai_rationale": "Eliminates supply-chain poison attacks and protects production deployment tokens."
    },
    {
        "id": "INT-06",
        "asset_id": "7",
        "asset_name": "Zero Trust Executive VPN Gateway",
        "title": "FIDO2 Passwordless MFA & Device Posture Check",
        "cost": 650000.0,  # ₹6.5 Lakhs
        "cvss_reduction": 1.8,
        "threat_frequency_reduction_pct": 35.0,
        "implementation_days": 7,
        "ai_rationale": "Blocks session hijacking and credential phishing targeting executive endpoints."
    },
    {
        "id": "INT-07",
        "asset_id": "6",
        "asset_name": "Enterprise HR & Payroll Portal",
        "title": "Role-Based Microsegmentation & Audit Logging",
        "cost": 550000.0,  # ₹5.5 Lakhs
        "cvss_reduction": 1.5,
        "threat_frequency_reduction_pct": 30.0,
        "implementation_days": 12,
        "ai_rationale": "Restricts internal lateral access to confidential payroll and executive salary tables."
    }
]

THREAT_SCENARIOS = {
    "baseline": {
        "id": "baseline",
        "name": "Standard Operational Baseline",
        "description": "Standard enterprise threat telemetry based on historical CVE metrics.",
        "threat_multiplier": 1.0,
        "loss_multiplier": 1.0,
        "targeted_categories": []
    },
    "ransomware": {
        "id": "ransomware",
        "name": "Targeted Ransomware Extortion Campaign",
        "description": "Simulates high-velocity double-extortion ransomware targeting identity infrastructure and databases.",
        "threat_multiplier": 2.2,
        "loss_multiplier": 1.8,
        "targeted_categories": ["Identity & Access Management", "Database & Cloud Infrastructure"]
    },
    "cloud_breach": {
        "id": "cloud_breach",
        "name": "Cloud Supply-Chain & Storage Exfiltration",
        "description": "Simulates compromised third-party dependencies leading to S3/GCS data lake leaks.",
        "threat_multiplier": 1.9,
        "loss_multiplier": 1.5,
        "targeted_categories": ["Cloud Storage & Analytics", "Infrastructure & Build"]
    },
    "fintech_ddos_api": {
        "id": "fintech_ddos_api",
        "name": "Payment Gateway API Disruption & Account Takeover",
        "description": "Massive credential stuffing and API abuse targeting customer-facing payment microservices.",
        "threat_multiplier": 2.5,
        "loss_multiplier": 1.6,
        "targeted_categories": ["Financial Services API"]
    }
}

def optimize_cyber_investment(
    budget: float,
    current_assets: List[Dict[str, Any]],
    risk_tolerance: str = "moderate"
) -> Dict[str, Any]:
    """
    Solves the Cyber Capital Allocation Problem:
    Maximizes Total Financial Risk Reduction (EAL delta) subject to Budget Constraint.
    """
    # 1. Map assets by ID for rapid lookup
    asset_lookup = {str(a["id"]): deepcopy(a) for a in current_assets}
    
    # 2. Score interventions by Marginal Efficiency of Capital (MEC = Risk Reduced / Rupee Spent)
    scored_interventions = []
    for item in SECURITY_INTERVENTIONS:
        target_asset = asset_lookup.get(item["asset_id"])
        if not target_asset:
            continue
            
        current_exposure = target_asset.get("financial_exposure", 10000000.0)
        # Estimated risk reduction from CVSS and frequency drop
        expected_reduction_pct = (item["cvss_reduction"] / 10.0 * 0.4) + (item["threat_frequency_reduction_pct"] / 100.0 * 0.6)
        estimated_eal_saved = current_exposure * expected_reduction_pct
        
        # Marginal Efficiency of Capital (MEC) ratio
        mec_score = estimated_eal_saved / item["cost"] if item["cost"] > 0 else 0
        
        scored_interventions.append({
            **item,
            "estimated_eal_saved": round(estimated_eal_saved, 2),
            "mec_score": round(mec_score, 3)
        })

    # Sort descending by efficiency (greedy knapsack approach optimal for hackathon demo)
    scored_interventions.sort(key=lambda x: x["mec_score"], reverse=True)

    # 3. Select interventions within budget
    allocated_funds = 0.0
    selected_interventions = []
    total_eal_saved = 0.0

    for candidate in scored_interventions:
        if (allocated_funds + candidate["cost"]) <= budget:
            allocated_funds += candidate["cost"]
            total_eal_saved += candidate["estimated_eal_saved"]
            selected_interventions.append(candidate)

    # Calculate baseline total EAL
    baseline_eal = sum(a.get("financial_exposure", 0.0) for a in current_assets)
    projected_residual_eal = max(0.0, baseline_eal - total_eal_saved)
    
    # Return on Security Investment (ROSI %) = ((Risk Mitigated - Security Cost) / Security Cost) * 100
    rosi_pct = round(((total_eal_saved - allocated_funds) / allocated_funds * 100), 1) if allocated_funds > 0 else 0.0

    # 4. Generate AI Executive Summary
    summary_memo = (
        f"EXECUTIVE CYBER INVESTMENT MEMO\n"
        f"Allocating ₹{allocated_funds / 100000:,.1f} Lakhs across {len(selected_interventions)} prioritized security initiatives "
        f"yields an Expected Annual Loss (EAL) suppression of ₹{total_eal_saved / 10000000:,.2f} Cr ({round((total_eal_saved / baseline_eal) * 100, 1)}% risk reduction). "
        f"The capital efficiency ratio (ROSI) is {rosi_pct}%, delivering a net capital preservation of "
        f"₹{(total_eal_saved - allocated_funds) / 10000000:,.2f} Cr to the enterprise balance sheet."
    )

    return {
        "status": "success",
        "budget_limit": budget,
        "allocated_budget": allocated_funds,
        "allocated_budget_formatted": f"₹{allocated_funds / 100000:,.1f} Lakhs",
        "unallocated_budget": budget - allocated_funds,
        "baseline_eal": round(baseline_eal, 2),
        "baseline_eal_formatted": f"₹{baseline_eal / 10000000:,.2f} Cr",
        "projected_residual_eal": round(projected_residual_eal, 2),
        "projected_residual_eal_formatted": f"₹{projected_residual_eal / 10000000:,.2f} Cr",
        "total_eal_saved": round(total_eal_saved, 2),
        "total_eal_saved_formatted": f"₹{total_eal_saved / 10000000:,.2f} Cr",
        "risk_reduction_pct": round((total_eal_saved / baseline_eal) * 100, 1) if baseline_eal > 0 else 0.0,
        "rosi_percentage": rosi_pct,
        "interventions_count": len(selected_interventions),
        "selected_interventions": selected_interventions,
        "ai_executive_memo": summary_memo
    }
