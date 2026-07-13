import { getDocs } from '@/utils/docs'

export const dynamic = 'force-static'

/**
 * The search index, served as a single static file.
 *
 * Search matches against every doc's headings, so it needs the whole corpus. Handing
 * that to a client component would serialize the corpus into each of the N exported
 * pages -- cost grows as pages x corpus, which is what pushed the export past the 1 GB
 * GitHub Pages limit. Emitting it once, fetched when the user opens search, keeps the
 * export linear in the size of the docs.
 */
export async function GET() {
  const { MDX } = process.env
  if (!MDX) throw new Error('MDX env var not set')

  const docs = await getDocs(MDX, null)

  // Only the fields SearchResult reads. Notably not `parent`, whose chains repeat the
  // ancestors of every heading.
  const index = docs.flatMap(({ tableOfContents }) =>
    tableOfContents.map(({ title, content, url, label }) => ({ title, content, url, label })),
  )

  return Response.json(index)
}
