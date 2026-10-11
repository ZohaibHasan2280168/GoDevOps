import { useState, useRef, useEffect, memo } from 'react'

const LazyImage = memo(({ src, alt, className, placeholder, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={`overflow-hidden ${className}`} {...props}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } w-full h-full object-cover`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          decoding="async"
        />
      )}
      {!isLoaded && placeholder && (
        <div className="w-full h-full bg-slate-800 animate-pulse flex items-center justify-center">
          {placeholder}
        </div>
      )}
    </div>
  )
})

LazyImage.displayName = 'LazyImage'
export default LazyImage