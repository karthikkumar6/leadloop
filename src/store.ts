import { demoState, makeDemoState } from './data'
import type { AppState } from './types'

const KEY = 'leadloop:workspace:v1'
const clone = <T,>(x:T):T => JSON.parse(JSON.stringify(x)) as T

export function readState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return clone(demoState)
    const parsed = JSON.parse(raw) as AppState
    if (!parsed.leads || !parsed.quotes || !parsed.workspace) return clone(demoState)
    return {
      ...parsed,
      workspace: { ...parsed.workspace, ownerName: parsed.workspace.ownerName || 'Kavya Sharma' },
      isDemo: typeof parsed.isDemo === 'boolean' ? parsed.isDemo : true,
    }
  } catch { return clone(demoState) }
}

export function writeState(state: AppState) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true } catch { return false }
}

export function resetState(): AppState {
  const next = makeDemoState()
  next.workspace.onboardingDone = true
  writeState(next)
  return next
}

export function emptyWorkspaceState(current: AppState): AppState {
  return {
    leads: [],
    quotes: [],
    workspace: { ...current.workspace, onboardingDone: true },
    isDemo: false,
  }
}
