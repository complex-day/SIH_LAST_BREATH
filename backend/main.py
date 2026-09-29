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
            "iso_27001": 88,
            "nist_csf": 74,
            "pci_dss": 91,
            "soc2": 82
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
