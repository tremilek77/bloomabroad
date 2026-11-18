declare module 'virtual:guides-meta' {
  export type GuideMeta = {
    slug: string
    title: string
    h1: string
    description: string
    answer: string
    audience: 'students' | 'universities'
    keyword: string
    published: boolean
    datePublished: string
    reviewed: string
    visa: boolean
    sources: { label: string; url: string; checked: string }[]
    related: string[]
    headings: { depth: number; text: string; id: string }[]
    readingMinutes: number
  }
  const guides: GuideMeta[]
  export default guides
}

declare module 'virtual:guides-html' {
  const html: Record<string, string>
  export default html
}
