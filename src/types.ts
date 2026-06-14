export interface Theory { id: string; name: string; nameEn: string; author: string; year: string; category: string; summary: string; relevance: string; color: string; icon: string }
export interface Case { id: string; name: string; type: string; tags: string[]; description: string; outcomes: string[]; votes: number; featured: boolean; year: number; institution: string; icon?: string }
export interface IntlCase { country: string; name: string; model: string; keyPoints: string[]; metrics: { label: string; value: string }[]; color: string }

export interface BlindBoxResult {
  name: string; score: number; trl: string; market_size: string;
  target_customers: string; competition_level: string; time_to_market: string;
  risk_level: string; strengths: string[]; weaknesses: string[];
  opportunities: string[]; threats: string[]; suggestion: string;
  source?: string; raw?: string;
}

export interface TripleHelixResult {
  professor: { name: string; analysis: string };
  ceo: { name: string; analysis: string };
  lawyer: { name: string; analysis: string };
}

export interface HWEvalResult {
  name: string;
  chip_benchmark: { recommended: string; performance: string; power: string };
  algorithm_fit: { score: number; bottleneck: string; optimization: string };
  bom_cost: { estimate: string; breakdown: Record<string, string> };
  localization_rate: number; risk_level: string; suggestion: string;
  source?: string; raw?: string;
}

export interface QuadHelixResult {
  algorithm_expert: { name: string; analysis: string };
  hw_pm: { name: string; analysis: string };
  supply_chain: { name: string; analysis: string };
  cert_advisor: { name: string; analysis: string };
}

export interface ModuleInfo {
  id: string; name: string; nameEn: string; icon: string;
  theory: string; desc: string; color: string;
}

export interface MapProvince {
  name: string; value: number; patents: number; transfers: number;
  institutes: number; coord: [number, number];
}

export interface AuthState {
  token: string; username: string; role: string;
}

export interface EvaluationRecord {
  id: number; type: string; input: Record<string,unknown>;
  result: Record<string,unknown>; source: string; created_at: string;
}

export interface FedMatchResult {
  source: string; query: string; total: number;
  results: Array<{
    id: string; title: string; field: string; ipc: string;
    trl: string; score: number; institution: string;
    tags: string[]; match_score?: number;
  }>;
}

export interface KGResult {
  source: string; query: string;
  nodes: Array<{ id: string; label: string; type: string; pagerank: number }>;
  edges: Array<{ source: string; target: string; label: string; weight: number }>;
}

export interface SupplyChainResult {
  source: string; query: string;
  chain: {
    nodes: Array<{ id: string; label: string; type: string; items: string[] }>;
    edges: Array<{ source: string; target: string; label: string }>;
    localization: Record<string, number>;
  };
}

export interface TechRadarResult {
  source: string;
  technologies: Array<{
    name: string; field: string; phase: string; maturity: number;
    pagerank: number; patents_2024: number; growth_yoy: string;
    substitutes: string[];
  }>;
}

export interface InnovationThermoResult {
  source: string; total_vectors: number; national_avg: number; updated: string;
  industries: Array<{
    industry: string; ai_rate: number; trend: string;
    key_apps: string[]; patents: number; growth: string;
  }>;
}
