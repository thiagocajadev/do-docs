'use client'

import { createRequiredContext } from '@/lib/createRequiredContext'
import { ReactNode } from 'react'

export type DocToC = {
  id: string
  level: number
  title: string
  content: string
  url: string
  parent: DocToC | null
  label: string
}

export type DocMetadata = {
  title: string
  description: string
}

export type Doc = {
  slug: string[]
  url: string
  editURL?: string
  sourcecode?: string
  sourcecodeURL?: string
  nav: number
  title?: ReactNode
  description?: ReactNode
  metadata: DocMetadata
  image: string
  content: ReactNode
  tableOfContents: DocToC[]
}

/**
 * A doc reduced to what the nav needs.
 *
 * Anything handed to a client component is serialized into every exported page, so the
 * two heavy fields are dropped: `content` (the compiled MDX tree) and `tableOfContents`
 * (the search corpus, now served once from search-index.json). Carrying either would
 * embed the whole corpus in each page -- cost as pages x corpus, gigabytes at our size.
 */
export type DocEntry = Omit<Doc, 'content' | 'tableOfContents'>

export type Ctx = { docs: DocEntry[]; doc: DocEntry }

const [hook, Provider] = createRequiredContext<Ctx>()

export { hook as useDocs }

export function DocsContext({ children, value }: { children?: ReactNode; value: Ctx }) {
  return <Provider value={value}>{children}</Provider>
}
