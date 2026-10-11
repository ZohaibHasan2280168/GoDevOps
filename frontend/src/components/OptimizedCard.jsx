import { memo, forwardRef } from 'react'

const OptimizedCard = memo(forwardRef(({ 
  children, 
  className = '', 
  onClick,
  hover = true,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        card performance-optimized
        ${hover ? 'hover:translate-y-[-2px] hover:shadow-lg' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{ 
        transform: 'translateZ(0)',
        willChange: hover ? 'transform, box-shadow' : 'auto'
      }}
      {...props}
    >
      {children}
    </div>
  )
}))

OptimizedCard.displayName = 'OptimizedCard'
export default OptimizedCard