export interface GithubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  fork: boolean
}

export interface GithubProfile {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
}

export interface LanguageStat {
  language: string
  count: number
  percentage: number
}

const GITHUB_API_BASE = "https://api.github.com"

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  }
  if (process.env.GITHUB_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_API_TOKEN}`
  }
  return headers
}

export async function fetchGithubProfile(username: string): Promise<GithubProfile | null> {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
      headers: githubHeaders(),
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return (await res.json()) as GithubProfile
  } catch {
    return null
  }
}

export async function fetchGithubRepos(username: string): Promise<GithubRepo[]> {
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`,
      { headers: githubHeaders(), next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    return (await res.json()) as GithubRepo[]
  } catch {
    return []
  }
}

/** Repo başına bir dil sayarak basit bir dağılım çıkarır (ML/AI değil, düz sayım). */
export function computeLanguageStats(repos: GithubRepo[]): LanguageStat[] {
  const counts = new Map<string, number>()
  let total = 0

  for (const repo of repos) {
    if (repo.fork || !repo.language) continue
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
    total += 1
  }

  if (total === 0) return []

  return Array.from(counts.entries())
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
}

export function topRepos(repos: GithubRepo[], limit = 6): GithubRepo[] {
  return [...repos]
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit)
}
