// https://sandpack.codesandbox.io/docs/guides/ssr#nextjs-app-dir

'use client'

import { getSandpackCssText } from '@codesandbox/sandpack-react'
import { useServerInsertedHTML } from 'next/navigation'
import { useRef } from 'react'

/**
 * Ensures CSSinJS styles are loaded server side.
 *
 * The callback runs on every flush of the RSC stream, not once per page, so returning
 * the stylesheet unconditionally emits a copy per flush -- on a long doc that was ~5000
 * identical copies, tens of MB of dead CSS in the HTML. Insert it on the first flush only.
 */
export const SandpackCSS = () => {
  const inserted = useRef(false)

  useServerInsertedHTML(() => {
    if (inserted.current) return null
    inserted.current = true

    return <style dangerouslySetInnerHTML={{ __html: getSandpackCssText() }} id="sandpack" />
  })

  return null
}
