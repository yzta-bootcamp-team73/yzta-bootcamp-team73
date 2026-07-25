export interface TeamMemberProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

export interface Team {
  id: string
  name: string
  description: string | null
  max_members: number
  created_by: string
}

export type IdeaStatus = "todo" | "doing" | "done"

export interface Idea {
  id: string
  team_id: string
  author_id: string
  title: string
  content: string | null
  status: IdeaStatus
  votes: number
}

export interface IcebreakerResponse {
  id: string
  team_id: string
  user_id: string
  question: string
  answer: string
}

export interface JoinableTeam {
  id: string
  name: string
  description: string | null
  max_members: number
}
