import { useState, useEffect } from 'react'

/**
 * Hook that implements a typewriter effect for terminal-style text output.
 * Used in the "System ID" terminal component for immersive storytelling.
 */
export function useTypewriter(text: string, speed: number = 30, startDelay: number = 0) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)

    const startTimeout = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1))
        index++
        if (index >= text.length) {
          clearInterval(interval)
          setIsComplete(true)
        }
      }, speed)

      return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(startTimeout)
  }, [text, speed, startDelay])

  return { displayedText, isComplete }
}
