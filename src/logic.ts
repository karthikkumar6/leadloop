import type { AppState, Lead, Quote, QuoteItem, Stage } from './types'

export const stages: Stage[] = ['New','Contacted','Qualified','Proposal sent','Negotiation','Won','Lost']
export const activeStages: Stage[] = stages.slice(0,5)
export const currency = (amount:number, code='INR') => new Intl.NumberFormat('en-IN',{style:'currency',currency:code,maximumFractionDigits:0}).format(amount || 0)
export const todayISO = () => { const n=new Date(); n.setMinutes(n.getMinutes()-n.getTimezoneOffset()); return n.toISOString().slice(0,10) }
export const dayDiff = (date:string, base=todayISO()) => { if(!date) return Infinity; return Math.round((new Date(`${date}T12:00:00`).getTime()-new Date(`${base}T12:00:00`).getTime())/86400000) }
export const quoteSubtotal = (items:QuoteItem[]) => items.reduce((sum,i)=>sum+Math.max(0,i.quantity)*Math.max(0,i.price),0)
export const quoteTotal = (quote:Pick<Quote,'items'|'discount'|'tax'>) => Math.max(0,quoteSubtotal(quote.items)-quote.discount)*(1+quote.tax/100)
export const leadQuote = (state:AppState,leadId:string) => state.quotes.filter(q=>q.leadId===leadId)
export const metrics = (state:AppState) => {
  const active=state.leads.filter(l=>!l.archived&&!['Won','Lost'].includes(l.stage))
  const closed=state.leads.filter(l=>!l.archived&&['Won','Lost'].includes(l.stage))
  const overdue=active.filter(l=>l.nextFollowUp&&dayDiff(l.nextFollowUp)<0)
  const dueToday=active.filter(l=>l.nextFollowUp&&dayDiff(l.nextFollowUp)===0)
  return { pipeline:active.reduce((s,l)=>s+l.value,0), won:state.leads.filter(l=>!l.archived&&l.stage==='Won').reduce((s,l)=>s+l.value,0), overdue:overdue.length, dueToday:dueToday.length, conversion:closed.length?Math.round(state.leads.filter(l=>!l.archived&&l.stage==='Won').length/closed.length*100):0, pendingQuotes:state.quotes.filter(q=>q.status==='Sent').length, active, closed, overdueLeads:overdue }
}
export interface RadarItem { lead:Lead; reason:'Overdue'|'Due today'|'Stale · high value'|'Coming up'; date:string; rank:number; detail:string }
export function radarItems(state:AppState):RadarItem[] {
  const result:RadarItem[]=[]
  for(const lead of state.leads.filter(l=>!l.archived&&!['Won','Lost'].includes(l.stage))){
    const due=dayDiff(lead.nextFollowUp)
    if(due<0) result.push({lead,reason:'Overdue',date:lead.nextFollowUp,rank:0,detail:`Follow-up slipped ${Math.abs(due)} day${due===-1?'':'s'} ago`})
    else if(due===0) result.push({lead,reason:'Due today',date:lead.nextFollowUp,rank:1,detail:'A follow-up is scheduled for today'})
    else if((!lead.lastContact||dayDiff(lead.lastContact)<-14)&&lead.value>=50000) result.push({lead,reason:'Stale · high value',date:lead.lastContact,rank:2,detail:`₹${new Intl.NumberFormat('en-IN').format(lead.value)} · no contact in ${lead.lastContact?`${Math.abs(dayDiff(lead.lastContact))} days`:'this lead yet'}`})
    else if(due>0&&due<=7) result.push({lead,reason:'Coming up',date:lead.nextFollowUp,rank:3,detail:`Follow-up in ${due} day${due===1?'':'s'}`})
  }
  return result.sort((a,b)=>a.rank-b.rank||a.date.localeCompare(b.date)||b.lead.value-a.lead.value)
}
export const stageCounts = (leads:Lead[]) => activeStages.map(stage=>({stage,leads:leads.filter(l=>!l.archived&&l.stage===stage),value:leads.filter(l=>!l.archived&&l.stage===stage).reduce((n,l)=>n+l.value,0)}))
export const weekStart = (d:Date) => {const n=new Date(d); n.setHours(0,0,0,0); n.setDate(n.getDate()-((n.getDay()+6)%7)); return n}
export function weeklyData(leads:Lead[], months=3) {
  const start=weekStart(new Date()); start.setDate(start.getDate()-7*(months*4-1))
  return Array.from({length:months*4},(_,i)=>{const from=new Date(start);from.setDate(from.getDate()+i*7);const to=new Date(from);to.setDate(to.getDate()+7); const batch=leads.filter(l=>{const d=new Date(l.createdAt);return d>=from&&d<to}); return {label:from.toLocaleDateString('en-IN',{month:'short',day:'numeric'}),leads:batch.length,value:batch.reduce((s,l)=>s+l.value,0),won:batch.filter(l=>l.stage==='Won').reduce((s,l)=>s+l.value,0)}})
}
export function trendData(leads:Lead[], period:'Weekly'|'Monthly') {
  if(period==='Weekly'){
    const start=weekStart(new Date()); start.setDate(start.getDate()-7*11)
    return Array.from({length:12},(_,i)=>{const from=new Date(start);from.setDate(from.getDate()+i*7);const to=new Date(from);to.setDate(to.getDate()+7);const batch=leads.filter(l=>{const d=new Date(l.createdAt);return d>=from&&d<to});return {label:from.toLocaleDateString('en-IN',{month:'short',day:'numeric'}),leads:batch.length,value:batch.reduce((s,l)=>s+l.value,0),won:batch.filter(l=>l.stage==='Won').reduce((s,l)=>s+l.value,0)}})
  }
  const start=new Date();start.setDate(1);start.setHours(0,0,0,0);start.setMonth(start.getMonth()-11)
  return Array.from({length:12},(_,i)=>{const from=new Date(start);from.setMonth(from.getMonth()+i);const to=new Date(from);to.setMonth(to.getMonth()+1);const batch=leads.filter(l=>{const d=new Date(l.createdAt);return d>=from&&d<to});return {label:from.toLocaleDateString('en-IN',{month:'short'}),leads:batch.length,value:batch.reduce((s,l)=>s+l.value,0),won:batch.filter(l=>l.stage==='Won').reduce((s,l)=>s+l.value,0)}})
}
export const activityLabel = (kind:string) => ({created:'New lead',note:'Note added',call:'Call logged',whatsapp:'WhatsApp logged',email:'Email logged',meeting:'Meeting logged',stage:'Stage updated',quote:'Quotation',reminder:'Follow-up',won:'Won',lost:'Lost',archived:'Archived'} as Record<string,string>)[kind]||'Activity'
