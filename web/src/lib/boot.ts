import { createElement, lazy, type ComponentProps, type ComponentType } from 'react'

/** Rendering on the server (build-time prerender) — no window, no storage. */
export const isServer = typeof window === 'undefined'

/**
 * True while the app takes over a prerendered page for the first time.
 * Entrance animations stay off during that first render so the HTML the visitor already sees does not blink.
 */
let takeover = !isServer && !!document.getElementById('root')?.hasChildNodes()
export const isTakeover = () => takeover
export const endTakeover = () => {
  takeover = false
}

/**
 * `React.lazy` with a `preload()` handle. Once preloaded, the component renders straight away (no Suspense
 * fallback), which lets the app replace prerendered HTML with identical content.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithPreload<C extends ComponentType<any>>(load: () => Promise<{ default: C }>) {
  let loaded: C | undefined
  let pending: Promise<unknown> | undefined
  const preload = () =>
    (pending ??= load().then(
      (m) => {
        loaded = m.default
      },
      (err) => {
        pending = undefined // let a later attempt retry (e.g. after a network blip)
        throw err
      },
    ))
  const Lazy = lazy(async () => {
    await preload()
    return { default: loaded! }
  })
  const Component = (props: ComponentProps<C>) => createElement((loaded ?? Lazy) as ComponentType<ComponentProps<C>>, props)
  return Object.assign(Component, { preload })
}
