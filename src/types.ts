export interface Theory {
  id: string
  name: string
  nameEn: string
  author: string
  year: string
  category: 'classical' | 'modern' | 'policy' | 'regional'
  summary: string
  relevance: string
  color: string
  icon: string
}

export interface Case {
  id: string
  name: string
  type: 'industry' | 'academic' | 'policy'
  tags: string[]
  description: string
  outcomes: string[]
  votes: number
  featured: boolean
  year: number
  institution: string
  submittedBy?: string
}

export interface Mechanism {
  id: string
  title: string
  description: string
  indicators: { label: string; value: string; unit: string; status: 'good' | 'warning' | 'critical' }[]
  icon: string
}

export interface IntlCase {
  country: string
  name: string
  model: string
  keyPoints: string[]
  metrics: { label: string; value: string }[]
  color: string
}