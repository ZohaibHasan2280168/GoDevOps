import { memo } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

const LazySection = memo(({ 
  children, 
  fallback = null, 
  rootMargin = '100px',
  threshold = 0.1,
  className = '',
  once = true
}) => {
  const { targetRef, isIntersecting, hasIntersected } = useIntersectionObserver({
    rootMargin,
    threshold
  })

  const shouldRender = once ? hasIntersected : isIntersecting

  return (
    <div 
      ref={targetRef} 
      className={`lazy-content ${className}`}
      style={{ 
        transform: 'translateZ(0)',
        minHeight: shouldRender ? 'auto' : '200px'
      }}
    >
      {shouldRender ? children : fallback}
    </div>
  )
})

LazySection.displayName = 'LazySection'
export default LazySection