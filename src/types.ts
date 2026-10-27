export type Stage = 'New' | 'Contacted' | 'Qualified' | 'Proposal sent' | 'Negotiation' | 'Won' | 'Lost'
export type Priority = 'Low' | 'Normal' | 'High' | 'Urgent'
export type ActivityKind = 'created' | 'note' | 'call' | 'whatsapp' | 'email' | 'meeting' | 'stage' | 'quote' | 'reminder' | 'won' | 'lost' | 'archived'

export interface Activity {
  id: string
  kind: ActivityKind
  text: string
  at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  service: string
  budget: number
  value: number
  eventDate: string
  source: string
  stage: Stage
  priority: Priority
  lastContact: string
  nextFollowUp: string
  notes: string
  lostReason: string
  archived: boolean
  createdAt: string
  activities: Activity[]
}

export interface QuoteItem { id: string; description: string; quantity: number; price: number }
export interface Quote {
  id: string
  leadId: string
  number: string
  title: string
  items: QuoteItem[]
  discount: number
  tax: number
  validUntil: string
  notes: string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired'
  createdAt: string
}

export interface Workspace {
  businessName: string
  category: string
  currency: string
  onboardingDone: boolean
}

export interface AppState { leads: Lead[]; quotes: Quote[]; workspace: Workspace; isDemo: boolean }
