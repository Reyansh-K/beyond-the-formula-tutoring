import type { PublicMentorProfile } from '@/lib/types'

export function mentorProfilePath(slug: string) {
  return `/mentors/p/${slug}`
}

export function slugifyMentorName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Initials for monogram tiles (no photos). */
export function mentorInitials(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

export function mentorBioExcerpt(bio: string, max = 160) {
  const t = bio.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trimEnd()}…`
}

const NAMED_MENTOR_SUBJECTS: { match: (name: string) => boolean; subjects: string[] }[] = [
  {
    match: (name) => name.includes('guhan') && name.includes('karthick'),
    subjects: ['PreCal', 'Calculus', 'SAT'],
  },
  {
    match: (name) => name.includes('krish') && name.includes('anand'),
    subjects: ['Algebra 2', 'PreCal'],
  },
]

/** Subject tags under a mentor's name. Named tutors use their assigned subjects; others use a short comma-separated focus. */
export function mentorSubjectTags(displayName: string, mentorFocus = ''): string[] {
  const name = displayName.trim().toLowerCase().replace(/\s+/g, ' ')
  const named = NAMED_MENTOR_SUBJECTS.find((row) => row.match(name))
  if (named) return named.subjects

  const parts = mentorFocus
    .split(/[,·|]/)
    .map((part) => part.trim())
    .filter(Boolean)
  if (parts.length === 0) return []
  if (parts.some((part) => part.length > 32 || part.includes('.'))) return []
  return parts
}

export const MENTOR_NOTES_MAX = 8
export const MENTOR_NOTE_MAX_LEN = 72
export const MENTOR_NOTES_FIELD_MAX = 600

/** One note per line; blank lines dropped; display capped at 8. */
export function parseMentorNotes(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, MENTOR_NOTES_MAX)
}

/** Normalize editor text for storage (trim lines, drop blanks, length caps). */
export function serializeMentorNotes(raw: string): string {
  const notes = parseMentorNotes(raw).map((n) => n.slice(0, MENTOR_NOTE_MAX_LEN))
  return notes.join('\n').slice(0, MENTOR_NOTES_FIELD_MAX)
}

export type MentorCardModel = Pick<
  PublicMentorProfile,
  'display_name' | 'mentor_slug' | 'mentor_bio' | 'mentor_focus'
>
