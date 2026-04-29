import NextImage, { type ImageProps as NextImageProps } from 'next/image'

import { cn } from '@/lib/utils'

type LoadingType = 'eager' | 'lazy'

export interface ImageProps extends Omit<NextImageProps, 'loading'> {
  /**
   * Use empty alt only for decorative images.
   */
  alt: string
  containerClassName?: string
  caption?: string
  rounded?: boolean
  shadow?: boolean
  loading?: LoadingType
}

export function Image({
  alt,
  className,
  containerClassName,
  caption,
  rounded = true,
  shadow = false,
  sizes = '100vw',
  priority,
  loading,
  ...props
}: ImageProps) {
  const computedLoading: LoadingType | undefined = priority ? undefined : (loading ?? 'lazy')

  return (
    <figure className={cn('w-full', containerClassName)}>
      <NextImage
        alt={alt}
        sizes={sizes}
        loading={computedLoading}
        priority={priority}
        className={cn(
          'h-auto w-full object-cover',
          rounded && 'rounded-lg',
          shadow && 'shadow-sm',
          className,
        )}
        {...props}
      />

      {caption ? <figcaption className="mt-2 text-sm text-slate-500">{caption}</figcaption> : null}
    </figure>
  )
}
