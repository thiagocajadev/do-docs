import { matchSorter } from 'match-sorter'
import * as React from 'react'

import cn from '@/lib/cn'
import { escape } from '@/utils/text'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { ComponentProps } from 'react'
import type { SearchResult } from './SearchItem'
import SearchItem from './SearchItem'

export const SearchModalContainer = ({
  className,
  close,
  indexUrl,
}: ComponentProps<'search'> & { close: () => void; indexUrl: string }) => {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const deferredQuery = React.useDeferredValue(query)
  const [results, setResults] = React.useState<SearchResult[]>([])

  // Fetched rather than served from context: see search-index.json/route.ts. The modal
  // only mounts once opened, so this costs nothing until the user searches.
  const [index, setIndex] = React.useState<SearchResult[]>([])

  React.useEffect(() => {
    let cancelled = false

    fetch(indexUrl)
      .then((res) => res.json())
      .then((entries: SearchResult[]) => {
        if (!cancelled) setIndex(entries)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [indexUrl])

  React.useEffect(() => {
    React.startTransition(() => {
      if (!deferredQuery) return setResults([])

      // Get length of matched text in result
      const relevanceOf = (result: SearchResult) =>
        (result.title.toLowerCase().match(escape(deferredQuery.toLowerCase()))?.length ?? 0) /
        result.title.length

      const results = matchSorter(index, deferredQuery, {
        keys: ['title', 'description', 'content'],
        threshold: matchSorter.rankings.CONTAINS,
      })
        // Sort by relevance
        .sort((a, b) => relevanceOf(b) - relevanceOf(a))
        // Truncate to top four results
        .slice(0, 4)

      setResults(results)
    })
  }, [index, deferredQuery])

  return (
    <search
      className={cn('[--Search-Input-height:--spacing(16)]', 'mt-(--Search-Input-top)', className)}
    >
      <Command shouldFilter={false} className="">
        <Command.Input
          name="search"
          id="search"
          className="bg-surface-container block h-(--Search-Input-height) w-full rounded-md px-4 pl-10 sm:text-sm"
          placeholder="Search the docs"
          value={query}
          autoFocus
          onValueChange={(value) => setQuery(value)}
        />

        <Command.List>
          {results.length > 0 && (
            <div className="bg-surface-container mt-1 flex max-h-[calc((100dvh-var(--Search-Input-top)-1.5rem)-var(--Search-Input-height))] flex-col gap-1 overflow-auto rounded-md p-1">
              {results.map((result, index) => {
                return (
                  <Command.Item
                    key={`search-item-${index}`}
                    value={result.url}
                    onSelect={(value) => {
                      router.push(value)
                      close()
                    }}
                    className="rounded-md transition-colors data-[selected=true]:bg-surface-container-high"
                  >
                    <SearchItem search={query} result={result} tabIndex={-1} />
                  </Command.Item>
                )
              })}
            </div>
          )}
        </Command.List>
      </Command>
    </search>
  )
}
