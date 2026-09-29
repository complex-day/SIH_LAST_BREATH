"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  TrendingDown,
  Layers,
  Activity,
  CheckCircle2,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Zap,
  Sliders,
  DollarSign,
  Cpu,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  LogOut,
  FileText,
  X,
  Clock,
  ArrowRight,
  Scale
} from "lucide-react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

// TypeScript Interfaces
interface DashboardMetrics {
  expected_annual_loss: number;
  expected_annual_loss_formatted: string;
  value_at_risk_95: number;
  value_at_risk_95_formatted: string;
  overall_risk_score: number;
  risk_grade: string;
  compliance_scores: {
    iso_27001: number;
    nist_csf: number;
    pci_dss: number;
    soc2: number;
  };
  rosi_percentage: number;
  total_monitored_assets: number;
  critical_vulnerabilities: number;
  currency: string;
  currency_symbol: string;
}

interface AssetExposure {
  id: string;
  name: string;
  category: string;
  cvss_score: number;
  business_value: number;
  threat_frequency: number;
  financial_exposure: number;
  value_at_risk_95: number;
  max_simulated_loss: number;
  risk_level: string;
  recommended_action: string;
  criticality?: string;
  owner?: string;
}

interface SecurityIntervention {
  id: string;
  asset_id: string;
  asset_name: string;
  title: string;
  cost: number;
  cvss_reduction: number;
  threat_frequency_reduction_pct: number;
  implementation_days: number;
  estimated_eal_saved: number;
  mec_score: number;
  ai_rationale: string;
}

interface OptimizationResult {
  budget_limit: number;
  allocated_budget: number;
  allocated_budget_formatted: string;
  unallocated_budget: number;
  baseline_eal: number;
  baseline_eal_formatted: string;
  projected_residual_eal: number;
  projected_residual_eal_formatted: string;
  total_eal_saved: number;
  total_eal_saved_formatted: string;
  risk_reduction_pct: number;
  rosi_percentage: number;
  interventions_count: number;
  selected_interventions: SecurityIntervention[];
  ai_executive_memo: string;
}

interface ImpactSummary {
  capital_waste_prevented: number;
  capital_waste_prevented_formatted: string;
  mean_time_to_detect_risk: string;
  periodic_audit_benchmark: string;
  compliance_coverage: {
    NIST_CSF_2_0: string;
    RBI_Cyber_Framework: string;
    ISO_27001: string;
  };
  projected_downtime_reduction: string;
  active_frameworks_count: number;
  calculation_basis: string;
}

interface PrioritizationItem {
  id: string;
  asset_name: string;
  category: string;
  vulnerability_cve: string;
  exposure_type: string;
  business_value: number;
  business_value_formatted: string;
  cvss_score: number;
  legacy_rank: number;
  legacy_priority: string;
  legacy_spend_status: string;
  legacy_action: string;
  cyberquant_rank: number;
  cyberquant_priority: string;
  cyberquant_eal: number;
  cyberquant_eal_formatted: string;
  cyberquant_action: string;
  rank_delta: string;
  financial_risk_driver: string;
  is_elevated: boolean;
  is_wasted_spend: boolean;
}

interface PrioritizationMatrixData {
  status: string;
  management_insight: string;
  capital_waste_saved_on_isolated_systems: string;
  capital_redirected_to_critical_systems: string;
  comparisons: PrioritizationItem[];
}


// Fallback baseline metrics
const FALLBACK_DASHBOARD: DashboardMetrics = {
  expected_annual_loss: 48650000,
  expected_annual_loss_formatted: "₹4.86 Cr",
  value_at_risk_95: 89400000,
  value_at_risk_95_formatted: "₹8.94 Cr",
  overall_risk_score: 74.2,
  risk_grade: "HIGH RISK",
  compliance_scores: {
    iso_27001: 88,
    nist_csf: 74,
    pci_dss: 91,
    soc2: 82
  },
  rosi_percentage: 240,
  total_monitored_assets: 10,
  critical_vulnerabilities: 5,
  currency: "INR",
  currency_symbol: "₹"
};

const FALLBACK_ASSETS: AssetExposure[] = [
  {
    id: "1",
    name: "Active Directory Domain Controller",
    category: "Identity & Access Management",
    cvss_score: 8.9,
    business_value: 15000000,
    threat_frequency: 7.2,
    financial_exposure: 14820000,
    value_at_risk_95: 22500000,
    max_simulated_loss: 28400000,
    risk_level: "CRITICAL",
    recommended_action: "Enforce zero-trust tiering, LAPS & privileged credential rotation",
    criticality: "Tier 1 - Mission Critical",
    owner: "SecOps Team"
  },
  {
    id: "2",
    name: "Core Banking Cloud DB",
    category: "Database & Cloud Infrastructure",
    cvss_score: 9.2,
    business_value: 12500000,
    threat_frequency: 6.5,
    financial_exposure: 13950000,
    value_at_risk_95: 20400000,
    max_simulated_loss: 26100000,
    risk_level: "CRITICAL",
    recommended_action: "Immediate emergency patch deployment & KMS key rotation",
    criticality: "Tier 1 - Mission Critical",
    owner: "Data Platform"
  },
  {
    id: "3",
    name: "Customer Payment Gateway",
    category: "Financial Services API",
    cvss_score: 8.8,
    business_value: 9800000,
    threat_frequency: 8.0,
    financial_exposure: 9240000,
    value_at_risk_95: 15600000,
    max_simulated_loss: 19800000,
    risk_level: "CRITICAL",
    recommended_action: "WAF rate-limiting rules & PCI-DSS tokenization audit",
    criticality: "Tier 1 - Mission Critical",
    owner: "FinTech Ops"
  },
  {
    id: "4",
    name: "Customer PII Data Lake",
    category: "Cloud Storage & Analytics",
    cvss_score: 8.1,
    business_value: 8200000,
    threat_frequency: 4.8,
    financial_exposure: 7120000,
    value_at_risk_95: 12800000,
    max_simulated_loss: 16500000,
    risk_level: "HIGH",
    recommended_action: "Automate column-level tokenization & IAM boundary audit",
    criticality: "Tier 1 - High",
    owner: "Data Governance"
  },
  {
    id: "5",
    name: "DevOps CI/CD Production Cluster",
    category: "Infrastructure & Build",
    cvss_score: 7.9,
    business_value: 5400000,
    threat_frequency: 5.5,
    financial_exposure: 4320000,
    value_at_risk_95: 7900000,
    max_simulated_loss: 10200000,
    risk_level: "HIGH",
    recommended_action: "Harden pipeline runners, isolate secrets in HashiCorp Vault",
    criticality: "Tier 2 - High",
    owner: "Platform Eng"
  }
];

const FALLBACK_OPTIMIZATION: OptimizationResult = {
  budget_limit: 7500000,
  allocated_budget: 7350000,
  allocated_budget_formatted: "₹73.5 Lakhs",
  unallocated_budget: 150000,
  baseline_eal: 48650000,
  baseline_eal_formatted: "₹4.86 Cr",
  projected_residual_eal: 14200000,
  projected_residual_eal_formatted: "₹1.42 Cr",
  total_eal_saved: 34450000,
  total_eal_saved_formatted: "₹3.45 Cr",
  risk_reduction_pct: 70.8,
  rosi_percentage: 368.7,
  interventions_count: 5,
  selected_interventions: [
    {
      id: "INT-01",
      asset_id: "1",
      asset_name: "Active Directory Domain Controller",
      title: "Zero-Trust Tiering & Privileged Access Management (PAM)",
      cost: 1800000,
      cvss_reduction: 2.4,
      threat_frequency_reduction_pct: 55,
      implementation_days: 21,
      estimated_eal_saved: 9633000,
      mec_score: 5.352,
      ai_rationale: "Neutralizes Kerberoasting and lateral movement across identity forests, reducing domain compromise probability by 55%."
    },
    {
      id: "INT-02",
      asset_id: "2",
      asset_name: "Core Banking Cloud DB",
      title: "Hardware Security Module (HSM) KMS & DB Activity Monitoring",
      cost: 2200000,
      cvss_reduction: 2.8,
      threat_frequency_reduction_pct: 60,
      implementation_days: 30,
      estimated_eal_saved: 9765000,
      mec_score: 4.439,
      ai_rationale: "Prevents unauthorized database exfiltration and satisfies RBI / PCI-DSS cryptographic mandates for financial records."
    },
    {
      id: "INT-03",
      asset_id: "3",
      asset_name: "Customer Payment Gateway",
      title: "AI WAF Layer & Tokenization Sandbox",
      cost: 1500000,
      cvss_reduction: 2.2,
      threat_frequency_reduction_pct: 50,
      implementation_days: 14,
      estimated_eal_saved: 5913600,
      mec_score: 3.942,
      ai_rationale: "Thwarts automated credential stuffing and API parameter manipulation on checkout microservices."
    },
    {
      id: "INT-04",
      asset_id: "4",
      asset_name: "Customer PII Data Lake",
      title: "Automated DLP & Object-Level Identity Boundaries",
      cost: 1200000,
      cvss_reduction: 1.9,
      threat_frequency_reduction_pct: 45,
      implementation_days: 18,
      estimated_eal_saved: 4129600,
      mec_score: 3.441,
      ai_rationale: "Mitigates large-scale data exfiltration risks and potential DPDP Act regulatory penalties."
    },
    {
      id: "INT-06",
      asset_id: "7",
      asset_name: "Zero Trust Executive VPN Gateway",
      title: "FIDO2 Passwordless MFA & Device Posture Check",
      cost: 650000,
      cvss_reduction: 1.8,
      threat_frequency_reduction_pct: 35,
      implementation_days: 7,
      estimated_eal_saved: 1850000,
      mec_score: 2.846,
      ai_rationale: "Blocks session hijacking and credential phishing targeting executive endpoints."
    }
  ],
  ai_executive_memo: "EXECUTIVE CYBER INVESTMENT MEMO\nAllocating ₹73.5 Lakhs across 5 prioritized security initiatives yields an Expected Annual Loss (EAL) suppression of ₹3.45 Cr (70.8% risk reduction). The capital efficiency ratio (ROSI) is 368.7%, delivering a net capital preservation of ₹2.71 Cr to the enterprise balance sheet."
};

const FALLBACK_IMPACT_SUMMARY: ImpactSummary = {
  capital_waste_prevented: 4850000,
  capital_waste_prevented_formatted: "₹48,50,000",
  mean_time_to_detect_risk: "14 minutes",
  periodic_audit_benchmark: "90 days",
  compliance_coverage: {
    NIST_CSF_2_0: "92%",
    RBI_Cyber_Framework: "88%",
    ISO_27001: "95%"
  },
  projected_downtime_reduction: "64%",
  active_frameworks_count: 3,
  calculation_basis: "Empirical reduction of misallocated remediation spend on isolated high-CVSS systems redirected to high-exposure revenue infrastructure."
};

const FALLBACK_PRIORITIZATION_MATRIX: PrioritizationMatrixData = {
  status: "success",
  management_insight: "Shifting from technical scores to financial quantification redirected ₹25L away from low-impact internal assets directly to the customer payment gateway.",
  capital_waste_saved_on_isolated_systems: "₹15,00,000",
  capital_redirected_to_critical_systems: "₹25,00,000",
  comparisons: [
    {
      id: "COMP-01",
      asset_name: "Customer Payment Gateway",
      category: "Financial Services API",
      vulnerability_cve: "CVE-2024-38199 (API Rate-Limit / Parameter Deserialization)",
      exposure_type: "Internet-Facing Transactional Gateway",
      business_value: 12000000.0,
      business_value_formatted: "₹1.20 Cr",
      cvss_score: 7.1,
      legacy_rank: 7,
      legacy_priority: "Medium-High",
      legacy_spend_status: "Deferred (Underfunded)",
      legacy_action: "Scheduled for Q4 vulnerability patching window",
      cyberquant_rank: 1,
      cyberquant_priority: "CRITICAL #1",
      cyberquant_eal: 9850000.0,
      cyberquant_eal_formatted: "₹98.5 Lakhs",
      cyberquant_action: "Immediate Zero-Day Mitigation & WAF Tokenization Rules",
      rank_delta: "+6 (Elevated)",
      financial_risk_driver: "High threat frequency (8.0 attacks/yr) coupled with ₹1.2 Cr business revenue throughput elevates financial exposure to enterprise maximum.",
      is_elevated: true,
      is_wasted_spend: false
    },
    {
      id: "COMP-02",
      asset_name: "Core Banking Cloud DB",
      category: "Database & Cloud Infrastructure",
      vulnerability_cve: "CVE-2024-21413 (Distributed Privilege Escalation)",
      exposure_type: "Multi-Region Cloud VPC Cluster",
      business_value: 12500000.0,
      business_value_formatted: "₹1.25 Cr",
      cvss_score: 9.2,
      legacy_rank: 2,
      legacy_priority: "Critical #2",
      legacy_spend_status: "Over-Allocated (₹20L)",
      legacy_action: "Emergency database downtime and complete patch sprint",
      cyberquant_rank: 2,
      cyberquant_priority: "CRITICAL #2",
      cyberquant_eal: 9420000.0,
      cyberquant_eal_formatted: "₹94.2 Lakhs",
      cyberquant_action: "KMS Key Rotation & Real-Time DB Activity Monitoring",
      rank_delta: "0 (Aligned)",
      financial_risk_driver: "High technical severity matched with massive data asset valuation justifies capital allocation.",
      is_elevated: false,
      is_wasted_spend: false
    },
    {
      id: "COMP-03",
      asset_name: "Active Directory Domain Controller",
      category: "Identity & Access Management",
      vulnerability_cve: "CVE-2024-43451 (NTLM Hash Disclosure / Pass-the-Hash)",
      exposure_type: "Hybrid Identity Forest",
      business_value: 15000000.0,
      business_value_formatted: "₹1.50 Cr",
      cvss_score: 8.9,
      legacy_rank: 3,
      legacy_priority: "Critical #3",
      legacy_spend_status: "Adequately Funded (₹18L)",
      legacy_action: "Domain controller snapshot rollback and DC patch",
      cyberquant_rank: 3,
      cyberquant_priority: "HIGH #3",
      cyberquant_eal: 8950000.0,
      cyberquant_eal_formatted: "₹89.5 Lakhs",
      cyberquant_action: "Privileged Access Management (PAM) & LAPS Enforcement",
      rank_delta: "0 (Aligned)",
      financial_risk_driver: "Enterprise crown jewel identity tier requires zero-trust segmentation.",
      is_elevated: false,
      is_wasted_spend: false
    },
    {
      id: "COMP-04",
      asset_name: "Customer PII Data Lake",
      category: "Cloud Storage & Analytics",
      vulnerability_cve: "CVE-2024-29972 (Object-Level Access Control Misconfig)",
      exposure_type: "Encrypted S3 Data Lake",
      business_value: 8200000.0,
      business_value_formatted: "₹82.0 Lakhs",
      cvss_score: 8.1,
      legacy_rank: 4,
      legacy_priority: "High #4",
      legacy_spend_status: "Standard Remediation",
      legacy_action: "Re-index bucket ACLs in next bi-weekly sprint",
      cyberquant_rank: 4,
      cyberquant_priority: "HIGH #4",
      cyberquant_eal: 6720000.0,
      cyberquant_eal_formatted: "₹67.2 Lakhs",
      cyberquant_action: "Automated Column-Level Tokenization & DLP Guardrails",
      rank_delta: "0 (Aligned)",
      financial_risk_driver: "DPDP Act regulatory exposure (up to ₹250 Cr statutory ceiling) demands automated data masking.",
      is_elevated: false,
      is_wasted_spend: false
    },
    {
      id: "COMP-05",
      asset_name: "DevOps CI/CD Production Cluster",
      category: "Infrastructure & Build",
      vulnerability_cve: "CVE-2024-23897 (Arbitrary File Read on Build Agent)",
      exposure_type: "Internal Kubernetes Node Pool",
      business_value: 5400000.0,
      business_value_formatted: "₹54.0 Lakhs",
      cvss_score: 7.9,
      legacy_rank: 5,
      legacy_priority: "High #5",
      legacy_spend_status: "High Spend (₹12L)",
      legacy_action: "Re-provision Jenkins/K8s clusters immediately",
      cyberquant_rank: 5,
      cyberquant_priority: "MEDIUM #5",
      cyberquant_eal: 4180000.0,
      cyberquant_eal_formatted: "₹41.8 Lakhs",
      cyberquant_action: "Ephemeral Secret Injection via Vault & Runner Hardening",
      rank_delta: "0 (Aligned)",
      financial_risk_driver: "Supply chain compromise risk balanced by moderate direct blast radius.",
      is_elevated: false,
      is_wasted_spend: false
    },
    {
      id: "COMP-06",
      asset_name: "Zero Trust Executive VPN Gateway",
      category: "Network & Perimeter",
      vulnerability_cve: "CVE-2024-21887 (VPN Command Injection Vulnerability)",
      exposure_type: "Perimeter Tunnel Endpoint",
      business_value: 3900000.0,
      business_value_formatted: "₹39.0 Lakhs",
      cvss_score: 7.1,
      legacy_rank: 6,
      legacy_priority: "Medium-High #6",
      legacy_spend_status: "Deferred",
      legacy_action: "Wait for vendor firmware maintenance window",
      cyberquant_rank: 6,
      cyberquant_priority: "MEDIUM #6",
      cyberquant_eal: 3210000.0,
      cyberquant_eal_formatted: "₹32.1 Lakhs",
      cyberquant_action: "FIDO2 Passwordless MFA & Device Posture Checks",
      rank_delta: "0 (Aligned)",
      financial_risk_driver: "Executive session hijacking potential contained by device attestation.",
      is_elevated: false,
      is_wasted_spend: false
    },
    {
      id: "COMP-07",
      asset_name: "Internal Staging & Legacy Archival Node",
      category: "Air-Gapped Internal Subnet",
      vulnerability_cve: "CVE-2024-38077 (Remote Code Execution in Windows RLS)",
      exposure_type: "Isolated Air-Gapped Test Network",
      business_value: 850000.0,
      business_value_formatted: "₹8.5 Lakhs",
      cvss_score: 9.2,
      legacy_rank: 1,
      legacy_priority: "CRITICAL #1",
      legacy_spend_status: "Misallocated Spend (₹15L Wasted)",
      legacy_action: "Emergency consultant engaged for isolated node patching",
      cyberquant_rank: 8,
      cyberquant_priority: "LOW #8",
      cyberquant_eal: 620000.0,
      cyberquant_eal_formatted: "₹6.2 Lakhs",
      cyberquant_action: "Compensating Network Boundary Isolation & Routine Patch",
      rank_delta: "-7 (Deprioritized)",
      financial_risk_driver: "Zero public ingress, zero customer records, and low asset value (₹8.5L) mean true business exposure is negligible despite CVSS 9.2 score.",
      is_elevated: false,
      is_wasted_spend: true
    }
  ]
};

// Data with primary curve (electric cyan), secondary ceiling (red), and target threshold (green)
const INVESTMENT_CURVE_DATA = [
  { investment: "₹0L", investmentNum: 0, residualLoss: 48650000, baselineCeiling: 55000000, targetThreshold: 15000000, reductionPct: 0, optimal: false },
  { investment: "₹15L", investmentNum: 15, residualLoss: 38200000, baselineCeiling: 55000000, targetThreshold: 15000000, reductionPct: 21.5, optimal: false },
  { investment: "₹30L", investmentNum: 30, residualLoss: 29500000, baselineCeiling: 55000000, targetThreshold: 15000000, reductionPct: 39.4, optimal: false },
  { investment: "₹50L", investmentNum: 50, residualLoss: 21100000, baselineCeiling: 55000000, targetThreshold: 15000000, reductionPct: 56.6, optimal: false },
  { investment: "₹75L", investmentNum: 75, residualLoss: 14200000, baselineCeiling: 55000000, targetThreshold: 15000000, reductionPct: 70.8, optimal: true },
  { investment: "₹100L", investmentNum: 100, residualLoss: 10400000, baselineCeiling: 55000000, targetThreshold: 15000000, reductionPct: 78.6, optimal: false },
  { investment: "₹150L", investmentNum: 150, residualLoss: 7800000, baselineCeiling: 55000000, targetThreshold: 15000000, reductionPct: 83.9, optimal: false },
  { investment: "₹200L", investmentNum: 200, residualLoss: 6900000, baselineCeiling: 55000000, targetThreshold: 15000000, reductionPct: 85.8, optimal: false },
];

export default function CyberQuantDashboard() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<DashboardMetrics>(FALLBACK_DASHBOARD);
  const [assets, setAssets] = useState<AssetExposure[]>(FALLBACK_ASSETS);
  const [impactSummary, setImpactSummary] = useState<ImpactSummary>(FALLBACK_IMPACT_SUMMARY);
  const [prioritizationMatrix, setPrioritizationMatrix] = useState<PrioritizationMatrixData>(FALLBACK_PRIORITIZATION_MATRIX);
  const [prioritizationMode, setPrioritizationMode] = useState<"financial" | "legacy">("financial");
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeInvestmentIndex, setActiveInvestmentIndex] = useState<number>(4);

  const [selectedScenario, setSelectedScenario] = useState<string>("baseline");
  const [budgetSlider, setBudgetSlider] = useState<number>(7500000);
  const [optimization, setOptimization] = useState<OptimizationResult>(FALLBACK_OPTIMIZATION);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [copiedMemo, setCopiedMemo] = useState<boolean>(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
  const [copiedBrief, setCopiedBrief] = useState<boolean>(false);


  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchBackendData();
    }
  }, [router]);

  const handleLogOut = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_email");
    router.push("/login");
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchBackendData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, assetRes, impactRes, comparisonRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/dashboard`, { cache: "no-store" }).catch(() => null),
        fetch(`${API_BASE_URL}/api/assets`, { cache: "no-store" }).catch(() => null),
        fetch(`${API_BASE_URL}/api/impact-summary`, { cache: "no-store" }).catch(() => null),
        fetch(`${API_BASE_URL}/api/prioritization-comparison`, { cache: "no-store" }).catch(() => null)
      ]);

      let liveConnected = false;

      if (dashRes && dashRes.ok) {
        const dashData = await dashRes.json();
        setDashboard(dashData);
        liveConnected = true;
      }
      if (assetRes && assetRes.ok) {
        const assetData = await assetRes.json();
        if (assetData.assets) setAssets(assetData.assets);
        liveConnected = true;
      }
      if (impactRes && impactRes.ok) {
        const impactData = await impactRes.json();
        setImpactSummary(impactData);
        liveConnected = true;
      }
      if (comparisonRes && comparisonRes.ok) {
        const comparisonData = await comparisonRes.json();
        if (comparisonData.comparisons) setPrioritizationMatrix(comparisonData);
        liveConnected = true;
      }

      setIsLiveApi(liveConnected);
    } catch {
      setIsLiveApi(false);
    } finally {
      setIsLoading(false);
    }
  };


  const runAiOptimization = async (customBudget?: number) => {
    setIsOptimizing(true);
    const targetBudget = customBudget !== undefined ? customBudget : budgetSlider;
    try {
      const res = await fetch(`${API_BASE_URL}/api/optimize-investment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget: targetBudget, risk_tolerance: "moderate" })
      });

      if (res.ok) {
        const data = await res.json();
        setOptimization(data);
      } else {
        simulateLocalOptimization(targetBudget);
      }
    } catch {
      simulateLocalOptimization(targetBudget);
    } finally {
      setIsOptimizing(false);
    }
  };

  const simulateLocalOptimization = (budget: number) => {
    const fraction = Math.min(budget / 10000000, 1.0);
    const saved = 48650000 * (0.2 + fraction * 0.65);
    const residual = Math.max(0, 48650000 - saved);
    const rosi = ((saved - budget) / budget) * 100;

    setOptimization({
      ...FALLBACK_OPTIMIZATION,
      budget_limit: budget,
      allocated_budget: budget * 0.95,
      allocated_budget_formatted: `₹${(budget / 100000).toFixed(1)} Lakhs`,
      total_eal_saved: saved,
      total_eal_saved_formatted: `₹${(saved / 10000000).toFixed(2)} Cr`,
      projected_residual_eal: residual,
      projected_residual_eal_formatted: `₹${(residual / 10000000).toFixed(2)} Cr`,
      risk_reduction_pct: Number(((saved / 48650000) * 100).toFixed(1)),
      rosi_percentage: Number(rosi.toFixed(1))
    });
  };

  const handleScenarioChange = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    if (!isLiveApi) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/simulate-scenario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: scenarioId })
      });
      if (res.ok) {
        const data = await res.json();
        setDashboard((prev) => ({
          ...prev,
          expected_annual_loss: data.stressed_eal,
          expected_annual_loss_formatted: data.stressed_eal_formatted,
          value_at_risk_95: data.stressed_var95,
          value_at_risk_95_formatted: data.stressed_var95_formatted
        }));
        if (data.top_affected_assets) {
          setAssets(data.top_affected_assets);
        }
      }
    } catch (e) {
      console.warn("Scenario API error:", e);
    }
  };


  const copyMemoToClipboard = () => {
    navigator.clipboard.writeText(optimization.ai_executive_memo);

    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  const boardBriefMarkdown = `# 🏛️ CYBERQUANT AI — EXECUTIVE BOARD BRIEF & DECISION MEMO
**Classification:** STRICTLY CONFIDENTIAL // C-SUITE & BOARD DISTRIBUTION
**Framework Alignment:** NIST CSF 2.0 (Govern & Identify) | FAIR Model v2.0 | RBI Cyber Security Framework
**Continuous Monitoring Telemetry:** Detection Latency: 14 Minutes (vs. 90-Day Industry Audit Lag)

---

### 1. CURRENT RISK EXPOSURE
* **Enterprise Risk Index:** ${dashboard.overall_risk_score} / 100 (${dashboard.risk_grade})
* **Monitored IT Assets:** ${dashboard.total_monitored_assets} Enterprise Nodes (Cloud DBs, Payment APIs, Identity Forests)
* **Critical Exposure Count:** ${dashboard.critical_vulnerabilities} High-Exposure Systems
* **Detection Latency:** 14 Minutes Continuous (NIST CSF 2.0 ID.RA-01) vs. 90-Day Periodic Audit Lag

### 2. POTENTIAL FINANCIAL LOSS
* **Expected Annual Loss (EAL):** ${dashboard.expected_annual_loss_formatted} Unmitigated Probabilistic Loss
* **Value at Risk (95% VaR):** ${dashboard.value_at_risk_95_formatted} Tail-Risk Financial Exposure (1-in-20 Year Catastrophe)
* **Projected Outage Liability:** ₹1.2 Cr per critical event on customer payment microservices

### 3. SECURITY GAP IDENTIFIED
* **Capital Misallocation:** Legacy CVSS technical rankings prioritized an isolated internal staging node (CVSS 9.2, ₹8.5L value), wasting ₹15L in emergency consultant patching.
* **Underfunded Crown Jewel:** The Internet-Facing Customer Payment Gateway (CVSS 7.1, ₹1.2 Cr value) was deferred despite driving ₹98.5L in true probabilistic financial loss.
* **Management Insight:** Shifting from technical scores to financial quantification redirected ₹25L away from low-impact internal assets directly to the customer payment gateway.

### 4. RECOMMENDED INVESTMENT
* **Optimized Capital Budget:** ${optimization.allocated_budget_formatted} (Marginal Efficiency of Capital / AI Knapsack Solution)
* **Prioritized Interventions:**
${optimization.selected_interventions.map((item, idx) => `  ${idx + 1}. ${item.title} on ${item.asset_name} (Cost: ₹${(item.cost / 100000).toFixed(1)}L | EAL Saved: ₹${(item.estimated_eal_saved / 100000).toFixed(1)}L)`).join("\n")}

### 5. EXPECTED RISK REDUCTION
* **Net Residual Loss (EAL):** Reduced from ${dashboard.expected_annual_loss_formatted} to ${optimization.projected_residual_eal_formatted} (-${optimization.risk_reduction_pct}% Net Risk Suppression)
* **Capital Efficiency Ratio (ROSI):** ${optimization.rosi_percentage}% Quantified Return on Security Investment
* **Business Downtime Shield:** 64% Outage Probability Reduction
* **Capital Waste Prevented:** ₹48,50,000 Preserved via Continuous FAIR Quantification

---
*Generated autonomously by CyberQuant AI Risk Engine (Continuous NIST CSF 2.0 Monitoring)*`;

  const copyBoardBriefToClipboard = () => {
    navigator.clipboard.writeText(boardBriefMarkdown);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  const formatRupees = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const selectedInvestment = INVESTMENT_CURVE_DATA[activeInvestmentIndex];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#ebd6d1] flex items-center justify-center">
        <div className="border-4 border-[#0faae6] bg-white p-6 rounded-none flex items-center gap-3">
          <div className="h-5 w-5 border-4 border-[#0faae6] border-t-transparent animate-spin rounded-none" />
          <span className="text-sm font-bold uppercase tracking-wider text-black">Verifying Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebd6d1] text-gray-900 selection:bg-[#0faae6] selection:text-white">
      {/* Top Navigation Bar: Stark White with Heavy Electric Blue Border */}
      <header className="sticky top-0 z-30 border-b-4 border-[#0faae6] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-none bg-[#0faae6] text-white border-2 border-black">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-black tracking-tight text-[#0faae6] text-xl uppercase">CyberQuant AI</span>
              <p className="text-xs font-bold text-gray-700 tracking-tight">
                Continuous Cyber Risk Quantification & Capital Optimization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live API Telemetry Badge */}
            <div className="hidden sm:flex items-center gap-2 rounded-none border-2 border-black bg-white px-3 py-1 text-xs font-bold text-black">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-none ${
                  isLiveApi ? "bg-[#0faae6] animate-pulse" : "bg-[#2546c7]"
                }`}
              />
              <span className="uppercase">{isLiveApi ? "1,000 Live Trials" : "Demo Engine"}</span>
            </div>

            {/* Stark Cobalt & Green Compliance Badges */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold">
              <span className="rounded-none border-2 border-green-600 bg-white px-2.5 py-1 text-green-700">
                ISO: 88%
              </span>
              <span className="rounded-none border-2 border-[#2546c7] bg-white px-2.5 py-1 text-[#2546c7]">
                NIST: 74%
              </span>
            </div>

            {/* Executive Decision Memo Export */}
            <button
              onClick={() => setIsBoardModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-none bg-[#f01c24] px-3.5 py-2 text-xs font-black text-white border-2 border-black uppercase tracking-wider hover:bg-red-700 transition"
              title="Generate Executive Board Memo"
            >
              <FileText className="h-3.5 w-3.5 text-white" />
              <span>Generate Board Brief</span>
            </button>

            {/* Interactive Electric Cyan Button */}
            <button
              onClick={fetchBackendData}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-none bg-[#0faae6] px-4 py-2 text-xs font-bold text-white border-2 border-black uppercase tracking-wider hover:bg-[#0d92c7] transition disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Simulate</span>
            </button>

            {/* Sharp Log Out Button */}
            <button
              onClick={handleLogOut}
              className="inline-flex items-center gap-1.5 rounded-none border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black uppercase tracking-wider hover:bg-gray-100 transition"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>


      {/* Main Container */}
      <main className="mx-auto max-w-7xl p-6 space-y-6">
        {/* NIST Continuous Monitoring & Impact Pulse (Top Banner / Grid) */}
        <section className="rounded-none border-4 border-[#0faae6] bg-white p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#0faae6] text-white px-2 py-1 border border-black font-black text-xs uppercase tracking-wider">
                NIST CSF 2.0
              </span>
              <h2 className="text-base font-black uppercase tracking-tight text-black flex items-center gap-2">
                <span>NIST Continuous Monitoring & Impact Pulse</span>
                <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-600 px-2 py-0.5">
                  Live Telemetry
                </span>
              </h2>
            </div>
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Continuous FAIR AI Risk Quantification vs. 90-Day Periodic Audits
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Badge 1: Detection Latency */}
            <div className="rounded-none border-2 border-black bg-[#ebd6d1] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-1.5 py-0.5 border border-black">
                  Detection Latency
                </span>
                <Clock className="h-4 w-4 text-[#0faae6]" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-[#0faae6] tracking-tight">
                  {impactSummary.mean_time_to_detect_risk}
                </div>
                <p className="text-[11px] font-bold text-gray-800 mt-0.5 uppercase">
                  Continuous vs {impactSummary.periodic_audit_benchmark} Static Audit
                </p>
              </div>
              <div className="text-[10px] font-black uppercase text-green-800 bg-white/70 px-1.5 py-0.5 border-t border-black">
                ⚡ 99.9% Detection Speedup (ID.RA-01)
              </div>
            </div>

            {/* Badge 2: Misallocated Spend Prevented */}
            <div className="rounded-none border-2 border-black bg-[#2546c7] text-white p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-1.5 py-0.5 border border-white">
                  Misallocated Spend
                </span>
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-white tracking-tight">
                  {impactSummary.capital_waste_prevented_formatted}
                </div>
                <p className="text-[11px] font-bold text-white/90 mt-0.5 uppercase">
                  Wasted Spend Prevented & Saved
                </p>
              </div>
              <div className="text-[10px] font-black uppercase text-yellow-300 bg-black/40 px-1.5 py-0.5 border-t border-white/40">
                🛡️ Zero Waste on Isolated Nodes (GV.OC)
              </div>
            </div>

            {/* Badge 3: NIST CSF 2.0 Alignment */}
            <div className="rounded-none border-2 border-black bg-white p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-black bg-[#ebd6d1] px-1.5 py-0.5 border border-black">
                  NIST CSF 2.0 Alignment
                </span>
                <ShieldCheck className="h-4 w-4 text-green-700" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-green-700 tracking-tight">
                  {impactSummary.compliance_coverage.NIST_CSF_2_0} Active
                </div>
                <p className="text-[11px] font-bold text-gray-700 mt-0.5 uppercase">
                  Continuous Risk Review (GV.RM)
                </p>
              </div>
              <div className="text-[10px] font-black uppercase text-gray-800 bg-[#ebd6d1]/60 px-1.5 py-0.5 border-t border-black flex justify-between">
                <span>RBI: {impactSummary.compliance_coverage.RBI_Cyber_Framework}</span>
                <span>•</span>
                <span>ISO: {impactSummary.compliance_coverage.ISO_27001}</span>
              </div>
            </div>

            {/* Badge 4: Business Downtime Shield */}
            <div className="rounded-none border-2 border-black bg-[#f01c24] text-white p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-1.5 py-0.5 border border-black">
                  Downtime Shield
                </span>
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-white tracking-tight">
                  {impactSummary.projected_downtime_reduction}
                </div>
                <p className="text-[11px] font-bold text-white/90 mt-0.5 uppercase">
                  Outage Probability Suppressed
                </p>
              </div>
              <div className="text-[10px] font-black uppercase text-white bg-black/40 px-1.5 py-0.5 border-t border-white/40">
                🚀 Operational Resilience (PR.DS)
              </div>
            </div>
          </div>
        </section>

        {/* Critical Risk & Alert: Intense Cobalt Blue Banner with Pure White Text */}
        <section className="rounded-none border-2 border-black bg-[#2546c7] text-white p-5">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-none bg-black text-white border border-white">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-black bg-white px-1.5 py-0.5 inline-block mb-1">
                  Active Threat Stress-Test
                </span>
                <div className="text-base font-extrabold uppercase tracking-tight text-white">
                  {selectedScenario === "ransomware"
                    ? "Targeted Ransomware Extortion Wave (+120% Threat Frequency)"
                    : selectedScenario === "cloud_breach"
                    ? "Cloud Supply-Chain & Storage Exfiltration (+90% Attack Rate)"
                    : selectedScenario === "fintech_ddos_api"
                    ? "Payment Gateway API Disruption & Account Takeover"
                    : "Standard Enterprise Threat Baseline (Operational Telemetry)"}
                </div>
              </div>
            </div>

            {/* Scenario Toggle Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "baseline", label: "Baseline" },
                { id: "ransomware", label: "Ransomware Wave" },
                { id: "cloud_breach", label: "Cloud Supply Breach" },
                { id: "fintech_ddos_api", label: "Payment API Attack" }
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleScenarioChange(sc.id)}
                  className={`rounded-none px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                    selectedScenario === sc.id
                      ? "bg-white text-black border-2 border-black"
                      : "bg-black/30 text-white border border-white hover:bg-black/50"
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Component A: 4 Metric Cards Alternating Between Stark White w/ Electric Blue Border and Intense Cobalt Blue Blocks */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Expected Annual Loss (Stark White with Heavy Electric Blue Border) */}
          <div className="rounded-none border-4 border-[#0faae6] bg-white p-6">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-green-600 pb-2">
              <span>Expected Annual Loss (EAL)</span>
              <DollarSign className="h-4 w-4 text-[#0faae6]" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black tracking-tight text-[#0faae6]">
                {dashboard.expected_annual_loss_formatted || formatRupees(dashboard.expected_annual_loss)}
              </div>
              <p className="mt-1 text-xs font-semibold text-gray-600">
                95% VaR: <span className="text-black font-bold">{dashboard.value_at_risk_95_formatted || formatRupees(dashboard.value_at_risk_95)}</span>
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[#2546c7] flex items-center gap-1.5 text-xs font-bold text-green-700 uppercase">
              <TrendingDown className="h-4 w-4" />
              <span>-14.2% Continuous Reduction</span>
            </div>
          </div>

          {/* Card 2: Enterprise Risk Score (Intense Cobalt Blue Block with Pure White Text) */}
          <div className="rounded-none border-2 border-black bg-[#2546c7] text-white p-6">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-white border-b-2 border-white pb-2">
              <span>Enterprise Risk Score</span>
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <div className="text-3xl font-black tracking-tight text-white">
                {dashboard.overall_risk_score}
              </div>
              <span className="text-xs text-white/80 font-bold">/ 100</span>
              <span className="ml-auto rounded-none bg-black text-white px-2 py-0.5 text-xs font-black uppercase border border-white">
                CRITICAL
              </span>
            </div>
            <div className="mt-4">
              <div className="h-2.5 w-full rounded-none bg-black/40 overflow-hidden border border-white">
                <div
                  className="h-full rounded-none bg-white transition-all duration-500"
                  style={{ width: `${dashboard.overall_risk_score}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-black uppercase text-white/90">
                <span>0 Low</span>
                <span>50 Median</span>
                <span>100 Critical</span>
              </div>
            </div>
          </div>

          {/* Card 3: ROSI (Stark White with Heavy Electric Blue Border) */}
          <div className="rounded-none border-4 border-[#0faae6] bg-white p-6">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-700 border-b-2 border-[#2546c7] pb-2">
              <span>Return on Security (ROSI)</span>
              <Zap className="h-4 w-4 text-[#0faae6]" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black tracking-tight text-[#0faae6]">
                {dashboard.rosi_percentage}%
              </div>
              <p className="mt-1 text-xs font-semibold text-gray-600">
                Quantified Return on Capital Preservation
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-green-600 flex items-center gap-1.5 text-xs font-bold text-green-700 uppercase">
              <CheckCircle2 className="h-4 w-4" />
              <span>3.4x Capital Preservation Multiplier</span>
            </div>
          </div>

          {/* Card 4: Critical Exposure Assets (Intense Cobalt Blue Block) */}
          <div className="rounded-none border-2 border-black bg-[#2546c7] text-white p-6">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-white border-b-2 border-white pb-2">
              <span>Monitored IT Assets</span>
              <Layers className="h-4 w-4 text-white" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <div className="text-3xl font-black tracking-tight text-white">
                {dashboard.total_monitored_assets}
              </div>
              <span className="text-xs text-white/90 font-bold uppercase">Enterprise Nodes</span>
            </div>
            <div className="mt-4 pt-2 border-t border-white flex items-center justify-between text-xs font-bold uppercase text-white">
              <span className="bg-black text-white px-2 py-0.5 border border-white">
                {dashboard.critical_vulnerabilities} High Exposure
              </span>
              <span>100% Telemetry</span>
            </div>
          </div>
        </section>

        {/* AI Cyber Investment Optimizer: Stark White Surface with Heavy Electric Blue Border */}
        <section className="rounded-none border-4 border-[#0faae6] bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-green-600 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#0faae6] p-1.5 text-white border border-black rounded-none">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-black tracking-tight text-[#0faae6] uppercase">
                  AI Cyber Investment Optimizer & Capital Allocation
                </h2>
              </div>
              <p className="text-xs font-bold text-gray-700 mt-1 uppercase tracking-wider">
                Marginal Efficiency of Capital (MEC) Solved via FAIR Quantitative Modeling
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={copyMemoToClipboard}
                className="inline-flex items-center gap-1.5 rounded-none border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black uppercase tracking-wider hover:bg-gray-100 transition"
              >
                {copiedMemo ? (
                  <>
                    <Check className="h-4 w-4 text-green-700" />
                    <span className="text-green-700">Memo Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-black" />
                    <span>Copy Board Memo</span>
                  </>
                )}
              </button>
              <button
                onClick={() => runAiOptimization(budgetSlider)}
                disabled={isOptimizing}
                className="inline-flex items-center gap-2 rounded-none bg-[#0faae6] px-4 py-2 text-xs font-bold text-white border-2 border-black uppercase tracking-wider hover:bg-[#0d92c7] transition disabled:opacity-50"
              >
                <Cpu className={`h-4 w-4 ${isOptimizing ? "animate-spin" : ""}`} />
                <span>Optimize Capital</span>
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Budget Control */}
            <div className="rounded-none border-2 border-black bg-[#ebd6d1] p-5 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-black uppercase text-black">
                  <span>Target Allocation Budget:</span>
                  <span className="text-base text-[#0faae6] bg-black px-2 py-0.5">
                    ₹{(budgetSlider / 100000).toFixed(0)} Lakhs
                  </span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={20000000}
                  step={500000}
                  value={budgetSlider}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBudgetSlider(val);
                    runAiOptimization(val);
                  }}
                  className="w-full mt-3 h-3 bg-white border-2 border-black appearance-none cursor-pointer accent-[#0faae6] rounded-none"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-800 uppercase mt-1">
                  <span>₹10L</span>
                  <span>₹1 Cr</span>
                  <span>₹2 Cr</span>
                </div>
              </div>

              {/* Quick Budget Presets */}
              <div className="flex gap-2">
                {[
                  { label: "₹25L", val: 2500000 },
                  { label: "₹50L", val: 5000000 },
                  { label: "₹75L Rec", val: 7500000 },
                  { label: "₹1.2Cr", val: 12000000 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setBudgetSlider(preset.val);
                      runAiOptimization(preset.val);
                    }}
                    className={`flex-1 py-1.5 text-xs font-black uppercase rounded-none border-2 border-black transition ${
                      budgetSlider === preset.val
                        ? "bg-[#0faae6] text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Projected Impact Panel: Cobalt Blue Block for Impact Highlights */}
              <div className="rounded-none border-2 border-black bg-[#2546c7] text-white p-4 space-y-3">
                <div className="text-xs font-black uppercase tracking-widest text-black bg-white px-2 py-0.5 inline-block">
                  Optimized Capital Outcome
                </div>
                <div className="flex justify-between items-baseline text-xs border-b border-white/40 pb-1">
                  <span className="font-bold">Baseline Annual Loss:</span>
                  <span className="font-black text-sm">{optimization.baseline_eal_formatted}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs border-b border-white/40 pb-1">
                  <span className="font-bold">Residual Annual Loss:</span>
                  <span className="font-black text-sm text-yellow-300">{optimization.projected_residual_eal_formatted}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs pt-1">
                  <span className="font-bold">Loss Prevented:</span>
                  <span className="font-black text-base text-white">{optimization.total_eal_saved_formatted} (-{optimization.risk_reduction_pct}%)</span>
                </div>
                <div className="flex justify-between items-baseline text-xs pt-1 border-t border-white">
                  <span className="font-bold">Simulated ROSI:</span>
                  <span className="font-black text-sm text-yellow-300">{optimization.rosi_percentage}% Return</span>
                </div>
              </div>
            </div>

            {/* AI Interventions List */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold uppercase text-gray-700 border-b-2 border-[#2546c7] pb-1">
                <span>Prioritized Interventions ({optimization.selected_interventions.length} Selected):</span>
                <span className="text-[#0faae6] font-black">
                  {optimization.allocated_budget_formatted} Allocated / ₹{(budgetSlider / 100000).toFixed(0)}L Budget
                </span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {optimization.selected_interventions.map((item, idx) => (
                  <div
                    key={item.id}
                    className="rounded-none border-2 border-black bg-white p-3 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-green-600 pb-2">
                      <div>
                        <div className="font-black text-black text-sm uppercase flex items-center gap-1.5">
                          <span className="text-[#0faae6]">#{idx + 1}</span>
                          <span>{item.title}</span>
                        </div>
                        <div className="text-[11px] font-bold text-gray-600 mt-0.5">
                          Target: <span className="text-black">{item.asset_name}</span> • Deploy in {item.implementation_days} days
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-sm text-[#0faae6]">{formatRupees(item.cost)}</div>
                        <span className="rounded-none bg-[#2546c7] text-white font-bold px-1.5 py-0.5 text-[10px] uppercase border border-black">
                          Save {formatRupees(item.estimated_eal_saved)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-gray-800 bg-[#ebd6d1]/60 p-2 text-[11px] font-semibold leading-relaxed border-l-4 border-[#0faae6]">
                      <span className="font-bold text-black uppercase">AI Defense Rationale: </span>
                      {item.ai_rationale}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Component B: Recharts AreaChart with Electric Cyan Primary Line and Stark Green & Cobalt Baselines */}
        <section className="rounded-none border-4 border-[#0faae6] bg-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#2546c7] pb-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#0faae6] uppercase">
                Optimal Cyber Investment Frontier
              </h2>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Diminishing Risk Curve (Electric Cyan) vs Unmitigated Ceiling (Cobalt Blue) vs Risk Appetite (Green)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 bg-[#0faae6] border border-black" />
                <span>Residual Loss Curve</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-[#2546c7]" />
                <span className="text-[#2546c7]">Unmitigated Baseline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-green-600" />
                <span className="text-green-700">Appetite Target</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={INVESTMENT_CURVE_DATA}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="avantGardeCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0faae6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0faae6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="investment"
                    stroke="#111827"
                    fontSize={11}
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={{ stroke: "#000", strokeWidth: 2 }}
                  />
                  <YAxis
                    stroke="#111827"
                    fontSize={11}
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={{ stroke: "#000", strokeWidth: 2 }}
                    tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-none border-2 border-black bg-white p-3 text-xs">
                            <div className="font-black text-black uppercase">
                              Spend: {data.investment}
                            </div>
                            <div className="mt-1 font-bold text-[#0faae6]">
                              Residual EAL: {formatRupees(data.residualLoss)}
                            </div>
                            <div className="font-bold text-green-700">
                              Mitigated: {data.reductionPct}%
                            </div>
                            {data.optimal && (
                              <div className="mt-1 bg-black text-white px-1.5 py-0.5 text-[10px] font-black uppercase">
                                ⭐ Recommended Optimal Frontier
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Secondary Line 1: Stark Cobalt Blue Ceiling */}
                  <Line
                    type="monotone"
                    dataKey="baselineCeiling"
                    stroke="#2546c7"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  {/* Secondary Line 2: Stark Green Target */}
                  <Line
                    type="monotone"
                    dataKey="targetThreshold"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                  {/* Primary Electric Cyan Curve */}
                  <Area
                    type="monotone"
                    dataKey="residualLoss"
                    stroke="#0faae6"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#avantGardeCyan)"
                  />
                  <ReferenceLine
                    x="₹75L"
                    stroke="#0faae6"
                    strokeWidth={2}
                    strokeDasharray="2 2"
                    label={{
                      value: "Optimal ROI Frontier",
                      fill: "#0faae6",
                      fontWeight: "bold",
                      fontSize: 11,
                      position: "insideTopRight"
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Scenario Selector */}
            <div className="flex flex-col justify-between rounded-none border-2 border-black bg-[#ebd6d1] p-4 text-xs">
              <div>
                <div className="flex items-center gap-1.5 text-black font-black uppercase mb-2">
                  <Sliders className="h-4 w-4 text-[#0faae6]" />
                  <span>Allocation Quick Selector</span>
                </div>
                <p className="text-gray-700 font-bold mb-3 uppercase text-[11px]">
                  Project continuous risk suppression by capital bucket:
                </p>

                <div className="space-y-1.5">
                  {INVESTMENT_CURVE_DATA.slice(0, 6).map((item, idx) => (
                    <button
                      key={item.investment}
                      onClick={() => setActiveInvestmentIndex(idx)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-none border-2 text-left font-bold uppercase transition ${
                        activeInvestmentIndex === idx
                          ? "border-black bg-[#0faae6] text-white"
                          : "border-transparent bg-white text-black hover:border-black"
                      }`}
                    >
                      <span>{item.investment}</span>
                      <span className={item.reductionPct > 50 ? "text-yellow-300 font-black" : "text-gray-700"}>
                        -{item.reductionPct}% EAL
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-black">
                <div className="font-bold text-gray-800 uppercase text-[10px]">Selected Projection:</div>
                <div className="font-black text-black text-sm mt-0.5">
                  Save {formatRupees(48650000 - selectedInvestment.residualLoss)}
                </div>
                <div className="text-[11px] font-bold text-[#2546c7] mt-0.5">
                  Residual: {formatRupees(selectedInvestment.residualLoss)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component: Legacy CVSS vs. Financial Risk Prioritization Matrix */}
        <section className="rounded-none border-4 border-[#0faae6] bg-white p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-black pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#0faae6] p-1.5 text-white border border-black font-black text-xs uppercase">
                  NIST ID.RA / GV.OC
                </span>
                <h2 className="text-lg font-black tracking-tight text-[#0faae6] uppercase">
                  Legacy CVSS vs. Financial Risk Prioritization Matrix
                </h2>
              </div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mt-1">
                Comparing Arbitrary Technical Scores (CVSS) vs True Probabilistic Expected Annual Loss (EAL)
              </p>
            </div>

            {/* Interactive Toggle: [View by Legacy CVSS] vs [View by CyberQuant Financial Impact] */}
            <div className="flex items-center gap-2 bg-[#ebd6d1] p-1.5 border-2 border-black">
              <button
                onClick={() => setPrioritizationMode("legacy")}
                className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition rounded-none ${
                  prioritizationMode === "legacy"
                    ? "bg-black text-white border-2 border-black"
                    : "bg-white text-black border border-black hover:bg-gray-100"
                }`}
              >
                View by Legacy CVSS (Technical Severity)
              </button>
              <button
                onClick={() => setPrioritizationMode("financial")}
                className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition rounded-none flex items-center gap-1.5 ${
                  prioritizationMode === "financial"
                    ? "bg-[#0faae6] text-white border-2 border-black"
                    : "bg-white text-black border border-black hover:bg-gray-100"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>View by CyberQuant Financial Impact</span>
              </button>
            </div>
          </div>

          {/* Management Insight Callout Box */}
          <div className="mt-4 rounded-none border-2 border-black bg-[#ebd6d1]/60 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="bg-[#0faae6] text-white p-2 border border-black font-black text-base shrink-0">
                  💡
                </div>
                <div>
                  <span className="font-black text-black uppercase tracking-wider text-xs block">
                    Management Insight
                  </span>
                  <p className="mt-0.5 text-black font-bold text-sm leading-relaxed">
                    {prioritizationMatrix.management_insight}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="border border-black bg-white px-3 py-1.5 text-center">
                  <div className="text-[10px] font-bold uppercase text-gray-600">Saved on Isolated Nodes</div>
                  <div className="text-xs font-black text-green-700">{prioritizationMatrix.capital_waste_saved_on_isolated_systems}</div>
                </div>
                <div className="border border-black bg-white px-3 py-1.5 text-center">
                  <div className="text-[10px] font-bold uppercase text-gray-600">Redirected to Payment Gateway</div>
                  <div className="text-xs font-black text-[#0faae6]">{prioritizationMatrix.capital_redirected_to_critical_systems}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Indicator Bar */}
          <div className={`mt-4 flex flex-wrap items-center justify-between gap-2 p-2.5 border-2 border-black text-xs font-bold uppercase ${
            prioritizationMode === 'legacy' ? 'bg-gray-100 text-gray-900' : 'bg-[#0faae6]/10 text-black'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 border border-black text-white font-black ${
                prioritizationMode === 'legacy' ? 'bg-black' : 'bg-[#0faae6]'
              }`}>
                {prioritizationMode === 'legacy' ? 'LEGACY AUDIT VIEW' : 'CYBERQUANT AI QUANTIFIED VIEW'}
              </span>
              <span>
                {prioritizationMode === 'legacy'
                  ? 'Assets ordered strictly by CVSS 0-10 score. Notice how isolated servers drain ₹15L while mission-critical payment APIs are deprioritized.'
                  : 'Assets ordered strictly by financial Expected Annual Loss (EAL). Crown jewels with live transactions take #1 priority.'}
              </span>
            </div>
            <span className="font-black text-black">
              Showing {prioritizationMatrix.comparisons.length} Evaluated Attack Surfaces
            </span>
          </div>

          {/* Comparison Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-xs font-black text-black uppercase tracking-wider bg-[#ebd6d1]">
                  <th scope="col" className="py-3 px-3 text-center">Rank</th>
                  <th scope="col" className="py-3 px-3">Asset & Attack Surface</th>
                  <th scope="col" className="py-3 px-3 text-center">CVSS Score</th>
                  <th scope="col" className="py-3 px-3">Asset Valuation</th>
                  <th scope="col" className="py-3 px-3">Financial Risk (EAL)</th>
                  <th scope="col" className="py-3 px-3">Capital Allocation Status</th>
                  <th scope="col" className="py-3 px-3">Remediation Action & Business Driver</th>
                </tr>
              </thead>
              <tbody>
                {[...prioritizationMatrix.comparisons]
                  .sort((a, b) =>
                    prioritizationMode === "legacy"
                      ? a.legacy_rank - b.legacy_rank
                      : a.cyberquant_rank - b.cyberquant_rank
                  )
                  .map((item, index) => {
                    const isLegacyMode = prioritizationMode === "legacy";
                    const isWasted = item.is_wasted_spend;
                    const isElevated = item.is_elevated;

                    // Row style logic
                    let rowBg = "hover:bg-[#ebd6d1]/40";
                    let borderClass = index % 2 === 0 ? "border-b border-green-600" : "border-b border-[#2546c7]";

                    if (isLegacyMode && isWasted) {
                      rowBg = "bg-gray-100 hover:bg-gray-200";
                    } else if (!isLegacyMode && isElevated) {
                      rowBg = "bg-[#0faae6]/10 hover:bg-[#0faae6]/20";
                    }

                    return (
                      <tr key={item.id} className={`${rowBg} transition ${borderClass}`}>
                        {/* Rank Column */}
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex flex-col items-center">
                            <span
                              className={`inline-block text-xs font-black px-2.5 py-1 rounded-none border border-black ${
                                isLegacyMode
                                  ? isWasted
                                    ? "bg-gray-300 text-gray-800"
                                    : "bg-black text-white"
                                  : isElevated
                                  ? "bg-[#f01c24] text-white"
                                  : item.cyberquant_rank <= 2
                                  ? "bg-[#2546c7] text-white"
                                  : "bg-[#0faae6] text-white"
                              }`}
                            >
                              #{isLegacyMode ? item.legacy_rank : item.cyberquant_rank}
                            </span>
                            {!isLegacyMode && (
                              <span
                                className={`text-[9px] font-black uppercase mt-1 px-1 border ${
                                  isElevated
                                    ? "text-red-700 bg-red-50 border-red-600"
                                    : isWasted
                                    ? "text-gray-700 bg-gray-100 border-gray-400"
                                    : "text-green-700 bg-green-50 border-green-600"
                                }`}
                              >
                                {item.rank_delta}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Asset & Attack Surface */}
                        <td className="py-3.5 px-3">
                          <div className="font-extrabold text-black uppercase flex items-center gap-1.5">
                            <span>{item.asset_name}</span>
                            {!isLegacyMode && isElevated && (
                              <span className="bg-[#f01c24] text-white text-[9px] font-black px-1.5 py-0.5 border border-black">
                                CRITICAL #1
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-gray-600 mt-0.5">
                            {item.category}
                          </div>
                          <div className="text-[10px] font-bold text-gray-700 mt-1 inline-block border border-black bg-white px-1.5 py-0.5">
                            {item.exposure_type}
                          </div>
                        </td>

                        {/* CVSS Score */}
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`inline-block text-xs font-black px-2 py-0.5 border border-black ${
                              item.cvss_score >= 8.5
                                ? "bg-[#2546c7] text-white"
                                : item.cvss_score >= 7.0
                                ? "bg-[#0faae6] text-white"
                                : "bg-white text-black"
                            }`}
                          >
                            {item.cvss_score.toFixed(1)}
                          </span>
                        </td>

                        {/* Business Value */}
                        <td className="py-3.5 px-3 font-bold text-black">
                          {item.business_value_formatted}
                        </td>

                        {/* Financial Exposure (EAL) */}
                        <td className="py-3.5 px-3">
                          <div className={`font-black text-sm ${
                            !isLegacyMode && isElevated
                              ? "text-[#f01c24] text-base"
                              : !isLegacyMode
                              ? "text-[#0faae6]"
                              : "text-black"
                          }`}>
                            {item.cyberquant_eal_formatted}
                          </div>
                          <div className="text-[10px] font-bold text-gray-600 uppercase">
                            Annualized Exposure
                          </div>
                        </td>

                        {/* Spend Allocation Status */}
                        <td className="py-3.5 px-3">
                          {isLegacyMode ? (
                            <span
                              className={`inline-block text-xs font-black px-2.5 py-1 border ${
                                isWasted
                                  ? "bg-gray-200 text-gray-900 border-gray-600"
                                  : isElevated
                                  ? "bg-red-100 text-red-800 border-red-600"
                                  : "bg-white text-black border-black"
                              }`}
                            >
                              {item.legacy_spend_status}
                            </span>
                          ) : (
                            <span
                              className={`inline-block text-xs font-black px-2.5 py-1 border ${
                                isElevated
                                  ? "bg-[#f01c24] text-white border-black"
                                  : isWasted
                                  ? "bg-green-100 text-green-900 border-green-700"
                                  : "bg-[#0faae6] text-white border-black"
                              }`}
                            >
                              {isElevated
                                ? "⚡ ELEVATED TO #1 (MAX RISK)"
                                : isWasted
                                ? "₹15L REDIRECTED TO REVENUE"
                                : "OPTIMAL CAPITAL FUNDED"}
                            </span>
                          )}
                        </td>

                        {/* Action & Driver */}
                        <td className="py-3.5 px-3">
                          <div className="text-xs font-bold text-black uppercase">
                            {isLegacyMode ? item.legacy_action : item.cyberquant_action}
                          </div>
                          <div className="mt-1 text-[11px] font-medium text-gray-700 leading-snug bg-white/80 p-1.5 border-l-2 border-black">
                            <span className="font-bold text-black uppercase">Risk Driver: </span>
                            {item.financial_risk_driver}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Executive Board Brief Modal */}
      {isBoardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white border-4 border-black p-6 rounded-none max-h-[90vh] flex flex-col shadow-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#f01c24] text-white p-1.5 border border-black">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black uppercase tracking-tight">
                    Executive Decision Memo & Board Brief
                  </h3>
                  <p className="text-xs font-bold text-gray-700">
                    FAIR Continuous Cyber Risk Quantification & Capital Optimization
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBoardModalOpen(false)}
                className="border-2 border-black bg-white p-1 hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5 text-black" />
              </button>
            </div>

            {/* 5-Step Executive Metric Flow */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="border-2 border-black bg-[#ebd6d1] p-2">
                <div className="text-[10px] font-black uppercase text-gray-700">1. Current Risk</div>
                <div className="text-sm font-black text-black mt-1">{dashboard.overall_risk_score} / 100</div>
                <div className="text-[9px] font-bold text-gray-600 mt-0.5">{dashboard.risk_grade}</div>
              </div>
              <div className="border-2 border-black bg-[#2546c7] text-white p-2">
                <div className="text-[10px] font-black uppercase text-white/80">2. Potential Loss</div>
                <div className="text-sm font-black text-yellow-300 mt-1">{dashboard.expected_annual_loss_formatted}</div>
                <div className="text-[9px] font-bold text-white/90 mt-0.5">{dashboard.value_at_risk_95_formatted} VaR</div>
              </div>
              <div className="border-2 border-black bg-[#f01c24] text-white p-2">
                <div className="text-[10px] font-black uppercase text-white/80">3. Security Gap</div>
                <div className="text-sm font-black text-white mt-1">₹15L Misallocated</div>
                <div className="text-[9px] font-bold text-white/90 mt-0.5">Payment Gateway Deferred</div>
              </div>
              <div className="border-2 border-black bg-white p-2">
                <div className="text-[10px] font-black uppercase text-gray-700">4. Recommended Spend</div>
                <div className="text-sm font-black text-[#0faae6] mt-1">{optimization.allocated_budget_formatted}</div>
                <div className="text-[9px] font-bold text-gray-600 mt-0.5">5 High-MEC Controls</div>
              </div>
              <div className="border-2 border-black bg-green-700 text-white p-2">
                <div className="text-[10px] font-black uppercase text-white/80">5. Risk Reduction</div>
                <div className="text-sm font-black text-white mt-1">-{optimization.risk_reduction_pct}% EAL</div>
                <div className="text-[9px] font-bold text-white/90 mt-0.5">{optimization.rosi_percentage}% ROSI</div>
              </div>
            </div>

            {/* Monospace Executive Markdown Area */}
            <div className="mt-4 flex-1 overflow-y-auto border-2 border-black bg-gray-900 p-4 text-xs font-mono text-gray-100 max-h-72">
              <pre className="whitespace-pre-wrap leading-relaxed select-all">
                {boardBriefMarkdown}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600">
                NIST CSF 2.0 (Govern & Identify) Continuous Verification
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyBoardBriefToClipboard}
                  className="inline-flex items-center gap-1.5 rounded-none bg-[#0faae6] px-4 py-2 text-xs font-black text-white border-2 border-black uppercase tracking-wider hover:bg-[#0d92c7] transition"
                >
                  {copiedBrief ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Executive Markdown</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsBoardModalOpen(false)}
                  className="rounded-none border-2 border-black bg-white px-4 py-2 text-xs font-black text-black uppercase tracking-wider hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t-4 border-[#0faae6] bg-white py-4 text-center">
      </footer>
    </div>
  );
}

