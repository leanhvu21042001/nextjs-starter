import * as React from 'react'
import { cn } from '@/lib/utils'

type SemanticProps<T extends HTMLElement> = React.HTMLAttributes<T>

export type SectionProps = SemanticProps<HTMLElement>
export type ArticleProps = SemanticProps<HTMLElement>
export type AsideProps = SemanticProps<HTMLElement>
export type HeaderProps = SemanticProps<HTMLElement>
export type NavProps = SemanticProps<HTMLElement>
export type MainProps = SemanticProps<HTMLElement>
export type FooterProps = SemanticProps<HTMLElement>

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, ...props }, ref) => {
    return <section ref={ref} className={cn(className)} {...props} />
  },
)
Section.displayName = 'Section'

export const Article = React.forwardRef<HTMLElement, ArticleProps>(
  ({ className, ...props }, ref) => {
    return <article ref={ref} className={cn(className)} {...props} />
  },
)
Article.displayName = 'Article'

export const Aside = React.forwardRef<HTMLElement, AsideProps>(({ className, ...props }, ref) => {
  return <aside ref={ref} className={cn(className)} {...props} />
})
Aside.displayName = 'Aside'

export const Header = React.forwardRef<HTMLElement, HeaderProps>(({ className, ...props }, ref) => {
  return <header ref={ref} className={cn(className)} {...props} />
})
Header.displayName = 'Header'

export const Nav = React.forwardRef<HTMLElement, NavProps>(({ className, ...props }, ref) => {
  return <nav ref={ref} className={cn(className)} {...props} />
})
Nav.displayName = 'Nav'

export const Main = React.forwardRef<HTMLElement, MainProps>(({ className, ...props }, ref) => {
  return <main ref={ref} className={cn(className)} {...props} />
})
Main.displayName = 'Main'

export const Footer = React.forwardRef<HTMLElement, FooterProps>(({ className, ...props }, ref) => {
  return <footer ref={ref} className={cn(className)} {...props} />
})
Footer.displayName = 'Footer'
