import type { WebGLRenderer } from 'three'
import type { WebGPURenderer } from 'three/webgpu'

export interface RendererOpts {
  antialias?: boolean
  alpha?: boolean
}

export type ItranRenderer = WebGLRenderer | WebGPURenderer
