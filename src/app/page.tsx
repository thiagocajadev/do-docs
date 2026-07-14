import { t } from '@/i18n'
import { svg } from '@/utils/icon'
import { parseDocsMetadata } from '@/utils/docs'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const NEXT_PUBLIC_LIBNAME = process.env.NEXT_PUBLIC_LIBNAME

const title = NEXT_PUBLIC_LIBNAME
const description = t('meta.description')(NEXT_PUBLIC_LIBNAME ?? '')

const icon = []
if (process.env.ICON) {
  icon.push({
    url: `data:image/svg+xml,${encodeURIComponent(svg(process.env.ICON))}`,
  })
}

export const metadata: Metadata = {
  title,
  description,
  icons: { icon },
  openGraph: {
    title,
    description,
    locale: t('meta.ogLocale'),
  },
}

/**
 * `/` is normally just a redirect: HOME_REDIRECT points at the first page of the docs.
 *
 * Without it, we land here -- so instead of a dead end, list the top-level sections so the reader
 * has somewhere to go.
 */
export default async function Page() {
  const HOME_REDIRECT = process.env.HOME_REDIRECT
  if (HOME_REDIRECT) redirect(HOME_REDIRECT)

  const MDX = process.env.MDX
  if (!MDX) throw new Error('MDX env var not set')

  // Metadata only: we need the section names and a page to link to, not the compiled content.
  const docs = await parseDocsMetadata(MDX)
  const firstPageOfSection = new Map<string, string>()
  for (const { slug, url } of docs) {
    const [section] = slug
    if (section && !firstPageOfSection.has(section)) firstPageOfSection.set(section, url)
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-bold text-on-surface">{NEXT_PUBLIC_LIBNAME}</h1>
      <p className="mt-3 text-on-surface-variant/70">{description}</p>

      <ul className="mt-10 divide-y divide-outline-variant/40 border-y border-outline-variant/40">
        {[...firstPageOfSection].map(([section, url]) => (
          <li key={section}>
            <Link
              href={url}
              className="block py-4 text-lg capitalize text-on-surface hover:text-primary"
            >
              {section.replace(/-/g, ' ')}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
