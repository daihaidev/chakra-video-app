
import { isAndroid, isIOS, isMobile } from "react-device-detect"

export type TWindowSize = {
  width: number | null
  height: number | null
  size?: string | null
}

export const breakpointValues = {
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em'
}

function parseBreakpoint(size: string) {
  const breakpointValue = breakpointValues?.[size]
  const breakpointToPx =
    Number.parseFloat(breakpointValue.split('em')?.[0]) * 16
  return breakpointToPx
}

export const isSm = (size: TWindowSize) => {
  return (
    size.width < parseBreakpoint('sm') && size.width < parseBreakpoint('md')
  )
}

export const isMd = (size: TWindowSize) => {
  return (
    size.width >= parseBreakpoint('md') && size.width < parseBreakpoint('lg')
  )
}

export const isLg = (size: TWindowSize) => {
  return (
    size.width > parseBreakpoint('lg') && size.width < parseBreakpoint('xl')
  )
}

export const isXl = (size: TWindowSize) => {
  return (
    size.width > parseBreakpoint('xl') && size.width < parseBreakpoint('xxl')
  )
}

export const isXXl = (size: TWindowSize) => {
  return size.width > parseBreakpoint('xxl')
}

export const isBrowser = ![typeof window, typeof document].includes('undefined')


export const isMobileDevice = (screenSize: TWindowSize) =>
  screenSize && (isMobile || isIOS || isAndroid || isSm(screenSize))