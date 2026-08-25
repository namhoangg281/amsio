import { WebGLRenderer } from 'three'
import { WebGPURenderer } from 'three/webgpu'
import { detectHasWebGPU } from './detect'
import type { ItranRenderer, RendererOpts } from './types'

export async function createRenderer(
  canvas: HTMLCanvasElement,
  opts: RendererOpts = {},
): Promise<ItranRenderer> {
  if (detectHasWebGPU()) {
    try {
      const r = new WebGPURenderer({ canvas, ...opts })
      await r.init()
      return r
    } catch { /* fall through */ }
  }
  return new WebGLRenderer({ canvas, ...opts })
}
