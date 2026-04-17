export async function runWithConcurrency<T, R>(
  items: T[],
  task: (item: T, index: number) => Promise<R>,
  limit = 5,
  delayBetweenBatches = 0,
): Promise<PromiseSettledResult<R>[]> {
  const normalizedLimit = Math.max(1, limit)
  const results: PromiseSettledResult<R>[] = new Array(items.length)

  for (let i = 0; i < items.length; i += normalizedLimit) {
    const batch = items.slice(i, i + normalizedLimit)
    const batchResults = await Promise.allSettled(batch.map((item, j) => task(item, i + j)))

    batchResults.forEach((result, index) => {
      results[i + index] = result
    })

    if (delayBetweenBatches > 0 && i + normalizedLimit < items.length) {
      await new Promise<void>((resolve) => setTimeout(resolve, delayBetweenBatches))
    }
  }

  return results
}
