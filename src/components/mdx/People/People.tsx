import cn from '@/lib/cn'
import { initials } from '@/utils/text'
import { Octokit } from '@octokit/core'
import Image from 'next/image'
import { cache, ComponentProps } from 'react'

//  ██████  ██████  ███    ██ ████████ ██████  ██ ██████  ██    ██ ████████  ██████  ██████  ███████
// ██      ██    ██ ████   ██    ██    ██   ██ ██ ██   ██ ██    ██    ██    ██    ██ ██   ██ ██
// ██      ██    ██ ██ ██  ██    ██    ██████  ██ ██████  ██    ██    ██    ██    ██ ██████  ███████
// ██      ██    ██ ██  ██ ██    ██    ██   ██ ██ ██   ██ ██    ██    ██    ██    ██ ██   ██      ██
//  ██████  ██████  ██   ████    ██    ██   ██ ██ ██████   ██████     ██     ██████  ██   ██ ███████

const octokit = new Octokit({
  auth: process.env.CONTRIBUTORS_PAT,
})

export async function Contributors({
  owner,
  repo,
  limit = 50,
  className,
  ...props
}: { owner: string; repo: string; limit: number } & ComponentProps<'ul'>) {
  const contributors = (
    await cachedFetchContributors(owner, repo).catch(
      (err) =>
        Array.from({ length: 100 }).map((_, index) => ({
          login: `jdoe-${index}`,
          html_url: 'https://github.com/jdoe',
        })) as Awaited<ReturnType<typeof cachedFetchContributors>>,
    )
  ).slice(0, limit)

  return (
    <div>
      <ul className={cn('flex flex-wrap gap-1', className)} {...props}>
        {contributors.map(({ html_url, avatar_url, login }) => (
          <li key={login}>
            <Avatar profileUrl={html_url} imageUrl={avatar_url} name={login} />
          </li>
        ))}
      </ul>
    </div>
  )
}

async function fetchContributors(owner: string, repo: string) {
  const res = await octokit.request(`GET /repos/{owner}/{repo}/collaborators`, {
    owner,
    repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  return res.data
}
const cachedFetchContributors = cache(fetchContributors)

//
// common
//

function Avatar({
  profileUrl,
  imageUrl,
  name,
  className,
  ...props
}: { profileUrl: string; imageUrl: string; name: string } & ComponentProps<'a'>) {
  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        className,
        'bg-surface-container-high inline-flex size-12 items-center justify-center overflow-clip rounded-full',
      )}
      {...props}
    >
      {imageUrl ? (
        <Image width="48" height="48" src={imageUrl} alt={name} className="size-full" />
      ) : (
        initials(name)
      )}
    </a>
  )
}
