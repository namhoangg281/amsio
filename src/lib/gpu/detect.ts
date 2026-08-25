export type GPUTier = 'webgpu' | 'webgl' | 'css'

export function detectHasWebGPU(): boolean {
  if (typeof navigator === 'undefined') return false
  return !!navigator.gpu
}

export async function detectGPUTier(): Promise<GPUTier> {
  if (typeof navigator === 'undefined') return 'css'
  if (navigator.gpu) {
    try {
      const adapter = await navigator.gpu.requestAdapter()
      if (adapter) return 'webgpu'
    } catch { /* fall through */ }
  }
  if (typeof document === 'undefined') return 'css'
  try {
    const canvas = document.createElement('canvas')
    if (canvas.getContext('webgl2')) return 'webgl'
  } catch { /* fall through */ }
  return 'css'
}
