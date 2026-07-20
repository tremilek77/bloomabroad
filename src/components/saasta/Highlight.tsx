import { cn } from '@/lib/utils'

/**
 * Renders `text` with the first occurrence of `phrase` wrapped in the
 * looping glimmer emphasis (lime + travelling shine). Falls back to plain
 * text if the phrase isn't found.
 */
export function Highlight({
  text,
  phrase,
  className,
}: {
  text: string
  phrase: string
  className?: string
}) {
  const idx = text.indexOf(phrase)
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span className={cn('text-glimmer', className)}>{phrase}</span>
      {text.slice(idx + phrase.length)}
    </>
  )
}
