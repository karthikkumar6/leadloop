import type { Lead } from './types'

export type MessagePurpose = 'Check in'|'Share a quotation'|'Nudge after silence'|'Confirm a meeting'|'Close the loop'
export type MessageTone = 'Warm'|'Clear'|'Concise'
export function messageFor(lead:Lead,purpose:MessagePurpose,tone:MessageTone,businessName:string){
  const first=lead.name.split(/\s|&/)[0]
  const offer=lead.service.toLowerCase()
  const warm:Record<MessagePurpose,string>={
    'Check in':`Hi ${first}! Hope your week is going well. I was thinking about your ${offer} plans and wanted to see what feels right so far. Happy to help with any questions.`,
    'Share a quotation':`Hi ${first}! I've put together the estimate for your ${offer} brief. Have a look when you get a moment — happy to walk through any part of it together.`,
    'Nudge after silence':`Hi ${first}, just circling back on your ${offer} enquiry. I know plans get busy — would it help if I sent over a couple of ideas for your date?`,
    'Confirm a meeting':`Hi ${first}! Looking forward to speaking about your ${offer} plans. Does our scheduled time still work for you?`,
    'Close the loop':`Hi ${first}, one last note from me about your ${offer} enquiry. If the timing has changed, no worries at all — just let me know and I'll close the loop on my side.`
  }
  const clear:Record<MessagePurpose,string>={
    'Check in':`Hi ${first}, following up on your ${offer} enquiry. Are you still exploring options for your event? I'm happy to answer questions or suggest a next step.`,
    'Share a quotation':`Hi ${first}, your ${offer} quotation is ready. Please let me know if you'd like any changes or if we can discuss the details.`,
    'Nudge after silence':`Hi ${first}, checking whether you'd like to move ahead with the ${offer} enquiry. If you can share where things stand, I'll plan accordingly.`,
    'Confirm a meeting':`Hi ${first}, confirming our conversation about your ${offer} plans. Please let me know if you'd like to keep the scheduled time.`,
    'Close the loop':`Hi ${first}, I haven't heard back about your ${offer} enquiry. Should I keep this open, or close it for now? Either is completely fine.`
  }
  const concise:Record<MessagePurpose,string>={
    'Check in':`Hi ${first}, checking in on your ${offer} plans. Any questions I can help with?`,
    'Share a quotation':`Hi ${first}, your ${offer} estimate is ready. Let me know if you'd like to talk it through.`,
    'Nudge after silence':`Hi ${first}, are you still looking for ${offer}? Happy to help if so.`,
    'Confirm a meeting':`Hi ${first}, does our scheduled chat about your ${offer} still work?`,
    'Close the loop':`Hi ${first}, should I keep your ${offer} enquiry open or close it for now?`
  }
  const blocks=tone==='Warm'?warm:tone==='Clear'?clear:concise
  return `${blocks[purpose]}\n\n${businessName}`
}
