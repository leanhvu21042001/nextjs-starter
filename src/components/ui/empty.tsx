export function Empty({ content }: { content?: string }) {
  return <div>{content || 'No content available'}</div>
}
