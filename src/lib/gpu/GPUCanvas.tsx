'use client'

import { Canvas } from '@react-three/fiber'
import type { CanvasProps } from '@react-three/fiber'
import { useState, useRef, useLayoutEffect, type ReactNode, type CSSProperties } from 'react'
import { createRenderer } from './factory'
import type { RendererOpts } from './types'

type Dims = { w: number; h: number }

export interface GPUCanvasProps extends Omit<CanvasProps, 'gl'> {
  rendererOpts?: RendererOpts
  loading?: ReactNode
  style?: CSSProperties
  className?: string
}

export function GPUCanvas({
  rendererOpts, loading, children, style, className, ...canvasProps
}: GPUCanvasProps) {
  const [ready, setReady] = useState(false)
  const [dims, setDims] = useState<Dims | null>(null)
  const dimsRef = useRef<Dims | null>(null)
  const outerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = outerRef.current
    if (!el) return
    const sync = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width > 0 && height > 0) {
        dimsRef.current = { w: width, h: height }
        setDims(prev => prev?.w === width && prev?.h === height ? prev : { w: width, h: height })
      }
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={outerRef} style={{ position: 'relative', width: '100%', height: '100%', ...style }} className={className}>
      {!ready && loading}
      {dims && (
        <Canvas {...canvasProps} style={{ position: 'absolute', inset: 0 }}
          gl={async (defaultProps) => {
            const canvas = defaultProps.canvas as HTMLCanvasElement
            const { w, h } = dimsRef.current ?? dims
            const renderer = await createRenderer(canvas, rendererOpts)
            renderer.setSize(w, h)
            setReady(true)
            return renderer
          }}
        >{children}</Canvas>
      )}
    </div>
  )
}
