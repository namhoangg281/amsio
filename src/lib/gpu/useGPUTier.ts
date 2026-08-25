import { useState, useEffect } from 'react'
import { detectGPUTier, type GPUTier } from './detect'

export interface GPUTierState {
  tier: GPUTier
  loading: boolean
}

export function useGPUTier(): GPUTierState {
  const [state, setState] = useState<GPUTierState>({ tier: 'css', loading: true })

  useEffect(() => {
    let cancelled = false
    detectGPUTier().then((tier) => {
      if (!cancelled) setState({ tier, loading: false })
    })
    return () => { cancelled = true }
  }, [])

  return state
}
