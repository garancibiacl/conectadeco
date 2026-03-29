import { useEffect, useRef, useState } from 'react'

function joinClasses(...values) {
  return values.filter(Boolean).join(' ')
}

export default function Reveal({
  as = 'div',
  children,
  className = '',
  delay = 0,
  duration = 700,
  threshold = 0.18,
  rootMargin = '0px 0px -10% 0px',
  trigger = 'scroll',
  variant = 'section',
  stagger = false,
  style,
  ...rest
}) {
  const Element = as
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(() => {
    if (trigger === 'load') return true
    if (typeof window === 'undefined') return false

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    if (trigger === 'load') {
      const frame = window.requestAnimationFrame(() => {
        setIsVisible(true)
      })

      return () => window.cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        setIsVisible(true)
        observer.unobserve(node)
      },
      { threshold, rootMargin },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [rootMargin, threshold, trigger])

  return (
    <Element
      ref={ref}
      style={{
        '--reveal-delay': `${delay}ms`,
        '--reveal-duration': `${duration}ms`,
        ...style,
      }}
      {...rest}
      className={joinClasses(
        'reveal',
        `reveal-${variant}`,
        stagger && 'reveal-stagger',
        isVisible && 'is-visible',
        className,
      )}
    >
      {children}
    </Element>
  )
}
