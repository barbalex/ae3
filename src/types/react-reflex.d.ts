// react-reflex (https://github.com/adlez/react-reflex) ships no type
// declarations and has no @types package; this covers the surface the
// app actually uses
declare module 'react-reflex' {
  import type { ComponentType } from 'react'
  import type { CSSProperties, ReactNode } from 'react'

  export interface ReflexResizeEvent {
    domElement?: HTMLElement
    [key: string]: unknown
  }

  export interface ReflexContainerProps {
    orientation?: 'horizontal' | 'vertical'
    className?: string
    style?: CSSProperties
    windowResizeAware?: boolean
    children?: ReactNode
    [key: string]: unknown
  }

  export interface ReflexElementProps {
    className?: string
    style?: CSSProperties
    size?: number
    minSize?: number
    maxSize?: number
    flex?: number
    propagateDimensions?: boolean
    dimensionIndices?: Record<string, number>
    onStartResize?: (event: ReflexResizeEvent) => void
    onStopResize?: (event: ReflexResizeEvent) => void
    children?: ReactNode
    [key: string]: unknown
  }

  export interface ReflexSplitterProps {
    className?: string
    style?: CSSProperties
    propagate?: boolean
    onStartResize?: (event: ReflexResizeEvent) => void
    onStopResize?: (event: ReflexResizeEvent) => void
    [key: string]: unknown
  }

  export const ReflexContainer: ComponentType<ReflexContainerProps>
  export const ReflexElement: ComponentType<ReflexElementProps>
  export const ReflexSplitter: ComponentType<ReflexSplitterProps>
}
