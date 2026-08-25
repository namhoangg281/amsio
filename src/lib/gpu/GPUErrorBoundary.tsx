import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

const defaultFallback = (
  <div role="img" aria-label="3D content unavailable"
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'transparent', color: '#E8590C', fontSize: '1.5rem' }}>
    🦊
  </div>
)

export class GPUErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError(): State { return { hasError: true } }
  render() { return this.state.hasError ? (this.props.fallback ?? defaultFallback) : this.props.children }
}
