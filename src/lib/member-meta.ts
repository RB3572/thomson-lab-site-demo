/** Team section metadata + the title dropdown, shared by the public team page,
 *  the admin editor, and the server (for grouping/seeding). */

export interface SectionMeta {
  id: string
  title: string
  /** rgba(...,0.8) glass-card accent (kept for the dark team page). */
  color: string
}

export const SECTIONS: SectionMeta[] = [
  { id: 'pi', title: 'Principal Investigator', color: 'rgba(247, 204, 52, 0.8)' },
  { id: 'postdocs', title: 'Postdocs', color: 'rgba(56, 189, 248, 0.8)' },
  { id: 'phd', title: 'PhD Students', color: 'rgba(167, 139, 250, 0.8)' },
  { id: 'undergrad', title: 'Undergraduate Students', color: 'rgba(52, 211, 153, 0.8)' },
  { id: 'staff', title: 'Research Staff', color: 'rgba(244, 114, 182, 0.8)' },
]

/** Titles offered in the admin dropdown; each maps to a display section. */
export const TITLE_OPTIONS: { label: string; section: string }[] = [
  { label: 'Principal Investigator', section: 'pi' },
  { label: 'Postdoctoral Scholar', section: 'postdocs' },
  { label: 'PhD Student', section: 'phd' },
  { label: 'Undergraduate Student', section: 'undergrad' },
  { label: 'Staff Scientist', section: 'staff' },
  { label: 'Research Technician', section: 'staff' },
]

/** Research-area tags offered in the admin editor. */
export const AREA_OPTIONS = ['Active Matter', 'Single-Cell', 'Machine Learning']

/** Best-effort mapping of a (possibly free-form) title to a section id. */
export function titleToSection(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('principal') || t.includes('professor')) return 'pi'
  if (t.includes('postdoc')) return 'postdocs'
  if (t.includes('phd')) return 'phd'
  if (t.includes('undergrad')) return 'undergrad'
  return 'staff'
}
