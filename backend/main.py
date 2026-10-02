import sys
import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

# Enable relative or absolute imports when running from root or backend folder
try:
    from backend.risk_engine import (
        run_monte_carlo_simulation,
        calculate_portfolio_eal,
        get_impact_summary,
        get_prioritization_comparison
    )
    from backend.mock_data import MOCK_ASSETS
    from backend.optimizer import optimize_cyber_investment, THREAT_SCENARIOS, SECURITY_INTERVENTIONS
except ImportError:
    from risk_engine import (
        run_monte_carlo_simulation,
        calculate_portfolio_eal,
        get_impact_summary,
        get_prioritization_comparison
    )
    from mock_data import MOCK_ASSETS
    from optimizer import optimize_cyber_investment, THREAT_SCENARIOS, SECURITY_INTERVENTIONS


app = FastAPI(
    title="CyberQuant AI - Cyber Risk Quantification & Investment Engine",
    description="Continuous Monte Carlo cyber risk quantification, Value at Risk (VaR), and capital allocation API.",
    version="1.1.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OptimizeRequest(BaseModel):
    budget: float = 7500000.0  # Default ₹75 Lakhs
    risk_tolerance: Optional[str] = "moderate"

class ScenarioRequest(BaseModel):
    scenario_id: str = "ransomware"

class QueryRequest(BaseModel):
    query: str

def compute_asset_exposures(
    threat_multiplier: float = 1.0,
    loss_multiplier: float = 1.0,
    targeted_categories: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    """
    Computes Monte Carlo financial exposure for all mock assets and sorts by risk.
    Supports stress testing under specific threat scenarios.
    """
    enriched_assets = []
    targeted_categories = targeted_categories or []
    
    for asset in MOCK_ASSETS:
        val = asset["business_value"]
        cvss = asset["cvss_score"]
        
        # Apply scenario multiplier if asset matches target profile
        is_targeted = len(targeted_categories) == 0 or asset["category"] in targeted_categories
        eff_threat_multiplier = threat_multiplier if is_targeted else 1.0
        eff_loss_multiplier = loss_multiplier if is_targeted else 1.0
        
        # Determine realistic bounds based on FAIR principles
        min_loss = val * 0.05 * eff_loss_multiplier
        mode_loss = val * (cvss / 25.0) * eff_loss_multiplier
        max_loss = val * 0.85 * eff_loss_multiplier
        
        sim_metrics = run_monte_carlo_simulation(
            threat_event_frequency=asset["threat_frequency"] * eff_threat_multiplier,
            loss_magnitude_min=min_loss,
            loss_magnitude_max=max_loss,
            loss_magnitude_mode=mode_loss,
            vulnerability_cvss=cvss,
            iterations=1000,
            seed=100 + int(asset["id"])
        )
        
        # Risk classification
        if cvss >= 8.5:
            risk_level = "CRITICAL"
            action = "Immediate patch deployment & automated micro-segmentation"
        elif cvss >= 7.5:
            risk_level = "HIGH"
            action = "Privileged credential rotation & EDR rule enforcement"
        elif cvss >= 6.0:
            risk_level = "MEDIUM"
            action = "Scheduled remediation sprint & configuration audit"
        else:
            risk_level = "LOW"
            action = "Continuous telemetry monitoring"

        enriched_assets.append({
            **asset,
            "financial_exposure": sim_metrics["expected_annual_loss"],
            "value_at_risk_95": sim_metrics["value_at_risk_95"],
            "max_simulated_loss": sim_metrics["max_simulated_loss"],
            "risk_level": risk_level,
            "recommended_action": action
        })
        
    # Sort descending by financial exposure (highest financial risk first)
    enriched_assets.sort(key=lambda x: x["financial_exposure"], reverse=True)
    return enriched_assets


@app.get("/")
def root():
    return {
        "service": "CyberQuant AI Risk Engine",
        "status": "online",
        "version": "1.2.0",
        "documentation": "/docs",
        "endpoints": [
            "/api/dashboard",
            "/api/assets",
            "/api/impact-summary",
            "/api/prioritization-comparison",
            "/api/scenarios",
            "/api/optimize-investment",
            "/api/simulate-scenario"
        ]
    }


@app.get("/api/impact-summary")
def get_impact_summary_metrics() -> Dict[str, Any]:
    """
    Returns quantified business impact metrics proving continuous AI risk quantification
    and capital efficiency benefits over traditional periodic audits.
    """
    return get_impact_summary()


@app.get("/api/prioritization-comparison")
def get_prioritization_comparison_matrix() -> Dict[str, Any]:
    """
    Returns side-by-side array comparing traditional technical CVSS prioritization
    against CyberQuant financial risk (EAL) prioritization.
    """
    return get_prioritization_comparison()



@app.get("/api/dashboard")
def get_dashboard_metrics() -> Dict[str, Any]:
    """
    Returns enterprise-wide EAL, overall Risk Score (0-100), and compliance percentages.
    """
    enriched_assets = compute_asset_exposures()
    
    enterprise_eal = sum(asset["financial_exposure"] for asset in enriched_assets)
    enterprise_var95 = sum(asset["value_at_risk_95"] for asset in enriched_assets)
    total_business_value = sum(asset["business_value"] for asset in enriched_assets)
    avg_cvss = sum(asset["cvss_score"] for asset in enriched_assets) / len(enriched_assets)
    
    exposure_ratio = min(enterprise_eal / (total_business_value * 0.4), 1.0)
    risk_score = round((avg_cvss * 6.5) + (exposure_ratio * 35.0), 1)
    risk_score = min(max(risk_score, 0.0), 100.0)

    critical_count = sum(1 for a in enriched_assets if a["cvss_score"] >= 8.0)
    
    return {
        "status": "success",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "expected_annual_loss": round(enterprise_eal, 2),
        "expected_annual_loss_formatted": f"₹{round(enterprise_eal / 10000000, 2)} Cr",
        "value_at_risk_95": round(enterprise_var95, 2),
        "value_at_risk_95_formatted": f"₹{round(enterprise_var95 / 10000000, 2)} Cr",
        "overall_risk_score": risk_score,
        "risk_grade": "HIGH RISK" if risk_score > 70 else "MODERATE",
        "compliance_scores": {
            "iso_27001": 95,
            "nist_csf": 92,
            "sebi_ccrf": 91,
            "rbi_csf": 88,
            "cis_controls": 89,
            "dpdp_act": 94
        },
        "rosi_percentage": 240,
        "total_monitored_assets": len(enriched_assets),
        "critical_vulnerabilities": critical_count,
        "currency": "INR",
        "currency_symbol": "₹"
    }


@app.get("/api/assets")
def get_high_risk_assets() -> Dict[str, Any]:
    """
    Returns the top 5 high-risk assets with their calculated financial exposure.
    """
    enriched_assets = compute_asset_exposures()
    top_5_assets = enriched_assets[:5]
    
    return {
        "status": "success",
        "total_returned": len(top_5_assets),
        "assets": top_5_assets
    }


@app.get("/api/scenarios")
def get_threat_scenarios() -> Dict[str, Any]:
    """
    Returns all pre-configured enterprise threat simulation scenarios.
    """
    return {
        "status": "success",
        "scenarios": list(THREAT_SCENARIOS.values())
    }


@app.post("/api/optimize-investment")
def run_capital_optimization(req: OptimizeRequest) -> Dict[str, Any]:
    """
    AI-Powered Capital Allocation:
    Computes optimal mitigation bundle that maximizes EAL risk reduction for a given budget.
    """
    current_assets = compute_asset_exposures()
    optimization_result = optimize_cyber_investment(
        budget=req.budget,
        current_assets=current_assets,
        risk_tolerance=req.risk_tolerance or "moderate"
    )
    return optimization_result


@app.post("/api/simulate-scenario")
def simulate_threat_scenario(req: ScenarioRequest) -> Dict[str, Any]:
    """
    Stress-tests the enterprise portfolio under an active threat scenario.
    """
    scenario = THREAT_SCENARIOS.get(req.scenario_id, THREAT_SCENARIOS["baseline"])
    
    stressed_assets = compute_asset_exposures(
        threat_multiplier=scenario["threat_multiplier"],
        loss_multiplier=scenario["loss_multiplier"],
        targeted_categories=scenario["targeted_categories"]
    )
    
    total_eal = sum(a["financial_exposure"] for a in stressed_assets)
    total_var95 = sum(a["value_at_risk_95"] for a in stressed_assets)
    
    return {
        "status": "success",
        "scenario": scenario,
        "stressed_eal": round(total_eal, 2),
        "stressed_eal_formatted": f"₹{round(total_eal / 10000000, 2)} Cr",
        "stressed_var95": round(total_var95, 2),
        "stressed_var95_formatted": f"₹{round(total_var95 / 10000000, 2)} Cr",
        "top_affected_assets": stressed_assets[:5]
    }


@app.post("/api/natural-language-query")
def natural_language_query(req: QueryRequest) -> Dict[str, Any]:
    """
    AI Decision Support Layer:
    Processes natural language queries from CISOs, Risk Officers, and Board Members,
    returning quantified monetary impacts, contributing drivers, and actionable recommendations.
    """
    q = req.query.lower().strip()
    enriched_assets = compute_asset_exposures()
    total_eal = sum(a["financial_exposure"] for a in enriched_assets)
    total_var95 = sum(a["value_at_risk_95"] for a in enriched_assets)
    
    # 1. What is our highest financial cyber risk today?
    if any(k in q for k in ["highest", "top risk", "biggest risk", "most risk", "highest financial"]):
        top_asset = enriched_assets[0]
        second_asset = enriched_assets[1]
        return {
            "status": "success",
            "query": req.query,
            "category": "Risk Driver Identification",
            "executive_summary": f"Your single highest financial cyber risk today is '{top_asset['name']}' with an Expected Annual Loss (EAL) of ₹{round(top_asset['financial_exposure']/100000, 2)} Lakhs and 95% Value at Risk (VaR) of ₹{round(top_asset['value_at_risk_95']/100000, 2)} Lakhs. While legacy CVSS treats all vulnerabilities above 8.5 equally, its ₹{round(top_asset['business_value']/10000000, 2)} Cr business valuation makes it your primary balance-sheet exposure.",
            "metrics": {
                "top_asset_name": top_asset["name"],
                "asset_financial_exposure": f"₹{round(top_asset['financial_exposure']/100000, 2)} Lakhs",
                "portfolio_eal_share": f"{round((top_asset['financial_exposure']/total_eal)*100, 1)}%",
                "cvss_score": str(top_asset["cvss_score"])
            },
            "contributing_factors": [
                f"{top_asset['name']} (EAL: ₹{round(top_asset['financial_exposure']/100000, 2)}L - Event frequency of {top_asset['threat_frequency']}/yr)",
                f"{second_asset['name']} (EAL: ₹{round(second_asset['financial_exposure']/100000, 2)}L - Mission critical transactional dependency)"
            ],
            "recommended_action": f"Deploy {top_asset['recommended_action']}. Expected risk suppression: ₹{round(top_asset['financial_exposure']*0.65/100000, 2)} Lakhs (65% reduction).",
            "framework_alignment": "NIST CSF 2.0 (ID.AM-05, ID.RA-01) & SEBI Cyber Resilience Framework (Risk Identification)"
        }
        
    # 2. Which vulnerabilities contribute most to our expected losses?
    elif any(k in q for k in ["vulnerabilities", "vulnerability", "cve", "contribute most", "losses"]):
        return {
            "status": "success",
            "query": req.query,
            "category": "Vulnerability Contribution Analysis",
            "executive_summary": "Expected losses are disproportionately driven by public-facing transactional APIs and identity systems rather than raw CVSS severity. Specifically, CVE-2024-38199 (API deserialization on Payment Gateway) and Kerberoasting in Active Directory drive over 59.2% (₹2.87 Cr) of total enterprise EAL.",
            "metrics": {
                "top_vulnerability": "CVE-2024-38199 (Payment Gateway)",
                "top_vulnerability_loss": "₹98.5 Lakhs EAL",
                "identity_vulnerability": "Kerberoasting & AD Domain Lateral Move",
                "identity_vulnerability_loss": "₹96.3 Lakhs EAL"
            },
            "contributing_factors": [
                "CVE-2024-38199 on Customer Payment Gateway: CVSS 7.1 creates ₹98.5L EAL due to high direct transactional exposure.",
                "Kerberoasting on Domain Controller: CVSS 8.9 threatens entire enterprise forest with ₹1.48 Cr tail risk.",
                "Unencrypted backup volumes on Cloud DB: Drives 24% of DPDP Act regulatory exposure."
            ],
            "recommended_action": "Prioritize patching CVE-2024-38199 and enforce Tier-0 Active Directory PAM. Avoid wasting ₹15L remediating isolated staging nodes (CVE-2024-38077).",
            "framework_alignment": "CIS Controls v8.1 (Control 7 - Vulnerability Management) & RBI Cyber Security Framework"
        }
        
    # 3. What happens if MFA is implemented across all privileged accounts?
    elif any(k in q for k in ["mfa", "multi-factor", "privileged", "accounts", "identity"]):
        suppressed_loss = 11483000.0  # ~₹1.15 Cr
        mfa_cost = 650000.0           # ₹6.5 Lakhs
        rosi = round(((suppressed_loss - mfa_cost) / mfa_cost) * 100, 1)
        return {
            "status": "success",
            "query": req.query,
            "category": "Control Simulation (What-If)",
            "executive_summary": f"Enforcing FIDO2 phishing-resistant MFA across all privileged accounts suppresses enterprise Expected Annual Loss by ₹1.15 Crore (23.6% reduction in portfolio risk). At an implementation cost of ₹6.5 Lakhs, this initiative yields an extraordinary {rosi}% Return on Security Investment (ROSI).",
            "metrics": {
                "implementation_cost": "₹6.5 Lakhs",
                "financial_loss_reduction": "₹1.15 Cr EAL Saved",
                "threat_frequency_suppression": "-55% Credential Attacks",
                "projected_rosi": f"{rosi}%"
            },
            "contributing_factors": [
                "Neutralizes 98.2% of automated credential stuffing and phishing attacks against Tier-1 admins.",
                "Directly protects Active Directory Domain Controller and Core Banking Cloud DB.",
                "Reduces probability of domain takeover by 55%."
            ],
            "recommended_action": "Execute immediate 7-day deployment of Hardware/FIDO2 MFA for all administrative and executive roles.",
            "framework_alignment": "NIST CSF 2.0 (PR.AC-07) & SEBI Cyber Resilience Framework (Access Control Section 4.2)"
        }
        
    # 4. How will delaying remediation by 30 days affect our financial exposure?
    elif any(k in q for k in ["delay", "30 days", "postpone", "defer", "remediation"]):
        daily_exposure = round(total_eal / 365, 2)
        added_exposure = round(daily_exposure * 30 * 1.35, 2)
        return {
            "status": "success",
            "query": req.query,
            "category": "Remediation Velocity & Delay Impact",
            "executive_summary": f"Delaying remediation by 30 days incurs an estimated ₹{round(added_exposure/100000, 2)} Lakhs in added unhedged financial exposure. As public exploit kits and CISA KEV listings mature, threat event frequencies compound at 1.35x, elevating 95% Value at Risk from ₹{round(total_var95/10000000, 2)} Cr to ₹{round((total_var95 + added_exposure * 1.8)/10000000, 2)} Cr.",
            "metrics": {
                "added_30_day_exposure": f"₹{round(added_exposure/100000, 2)} Lakhs",
                "daily_unhedged_burn_rate": f"₹{round(daily_exposure/1000, 1)}K / day",
                "exploit_compounding_rate": "+35% Threat Ramp",
                "regulatory_penalty_risk": "₹1.25 Cr (DPDP Act Non-Compliance)"
            },
            "contributing_factors": [
                "Vulnerabilities in Customer Payment Gateway and Active Directory are actively weaponized in the wild.",
                "Delayed patching converts low-cost preventative maintenance into emergency incident response costs.",
                "Breaches after 30-day disclosure windows trigger mandatory statutory penalties under DPDP Act 2023."
            ],
            "recommended_action": "Do not defer. Trigger the automated ₹73.5L AI Knapsack optimization bundle to lock in 70.8% immediate loss suppression.",
            "framework_alignment": "ISO/IEC 27001 (A.12.6.1 Technical Vulnerability Management) & RBI Cyber Security Framework"
        }
        
    # 5. General intelligent response
    else:
        top_asset = enriched_assets[0]
        return {
            "status": "success",
            "query": req.query,
            "category": "Executive Risk Intelligence",
            "executive_summary": f"CyberQuant AI continuously monitors {len(enriched_assets)} enterprise assets with a combined baseline Expected Annual Loss of ₹{round(total_eal/10000000, 2)} Cr and 95% Value at Risk of ₹{round(total_var95/10000000, 2)} Cr. Financial exposure is concentrated in {top_asset['category']} ({top_asset['name']}). Applying our ₹75L AI-optimized mitigation package will reduce overall risk by 70.8% with a 368.7% ROSI.",
            "metrics": {
                "portfolio_eal": f"₹{round(total_eal/10000000, 2)} Cr",
                "value_at_risk_95": f"₹{round(total_var95/10000000, 2)} Cr",
                "optimal_budget": "₹75.0 Lakhs",
                "projected_rosi": "368.7%"
            },
            "contributing_factors": [
                f"Top risk contributor: {top_asset['name']} (₹{round(top_asset['financial_exposure']/100000, 2)}L EAL)",
                "Continuous detection latency: 14 minutes vs 90-day periodic audit cycle",
                "Statutory compliance across 6 frameworks including NIST CSF, SEBI CCRF, CIS Controls, and RBI CSF"
            ],
            "recommended_action": "Use the AI Capital Allocation slider to model specific budget envelopes and generate the 1-Click Executive Decision Memo.",
            "framework_alignment": "NIST CSF 2.0, SEBI Cyber Resilience, CIS Controls v8.1 & RBI Cyber Security"
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
