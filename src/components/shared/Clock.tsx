'use client'

import { useEffect, useState } from 'react'

interface ClockProps {
  format?: string
  className?: string
  isCollapsed?: boolean
}

export default function Clock({ format = "HH:mm", className = "", isCollapsed = false }: ClockProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center">
        <span className={className}>{hours}</span>
        <span className={`text-xs ${className}`}>-</span>
        <span className={className}>{minutes}</span>
      </div>
    )
  }

  return (
    <span className={className}>
      {hours}:{minutes}
    </span>
  )
}
