import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const db = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

// ─── Types ───────────────────────────────────────────────────────────────────

export type LeadStatus =
  | 'new'
  | 'demo_sent'
  | 'interested'
  | 'proposal_sent'
  | 'contract_pending'
  | 'client'
  | 'lost'

export type ContractStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'sent'
  | 'signed'
  | 'cancelled'

export interface Lead {
  id: string
  business_name: string
  owner_name: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  niche: string | null
  website_url: string | null
  google_rating: number | null
  google_reviews: number | null
  google_place_id: string | null
  website_score: number | null
  lead_score: number | null
  status: LeadStatus
  demo_url: string | null
  notes: string | null
  created_at: string
  last_contacted_at: string | null
  follow_up_at: string | null
}

export interface Message {
  id: string
  lead_id: string
  channel: 'email' | 'whatsapp'
  direction: 'outbound' | 'inbound'
  subject: string | null
  body: string
  wa_msg_id: string | null
  sent_at: string
}

export interface Contract {
  id: string
  lead_id: string
  plan: 'starter' | 'professional' | 'premium'
  setup_fee: number
  monthly_fee: number
  status: ContractStatus
  content: string | null
  created_at: string
  approved_at: string | null
  sent_at: string | null
  signed_at: string | null
}

export interface AgencyKPIs {
  leads_this_week: number
  demos_sent_this_week: number
  replies_this_week: number
  total_clients: number
  current_mrr: number
  contracts_pending: number
  hot_leads: number
}
