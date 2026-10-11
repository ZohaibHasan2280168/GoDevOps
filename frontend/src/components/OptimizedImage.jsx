import { useState, useRef, useEffect, memo } from 'react'

const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '', 
  placeholder,
  width,
  height,
  priority = false,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [error, setError] = useState(false)
  const imgRef = useRef()

  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    setError(false)
  }

  const handleError = () => {
    setError(true)
    setIsLoaded(false)
  }

  return (
    <div 
      ref={imgRef} 
      className={`overflow-hidden ${className}`} 
      style={{ width, height }}
      {...props}
    >
      {isInView && !error && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 will-change-transform ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{ transform: 'translateZ(0)' }}
        />
      )}
      
      {(!isLoaded || error) && (
        <div className="w-full h-full bg-slate-800/50 animate-pulse flex items-center justify-center">
          {error ? (
            <div className="text-slate-500 text-sm">Failed to load</div>
          ) : (
            placeholder || <div className="w-8 h-8 bg-slate-700 rounded"></div>
          )}
        </div>
      )}
    </div>
  )
})

OptimizedImage.displayName = 'OptimizedImage'
export default OptimizedImage