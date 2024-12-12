'use client'

import { useState, useEffect } from 'react'

interface ClockProps {
  isVertical?: boolean
  isCollapsed?: boolean
}

export default function Clock({ isVertical = false, isCollapsed = false }: ClockProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')

  if (isVertical && isCollapsed) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-xl font-bold bg-gradient-to-b from-[#C6A55C] to-[#E9D5A0] bg-clip-text text-transparent">
          {hours}
        </div>
        <div className="text-[#C6A55C] font-bold">-</div>
        <div className="text-xl font-bold bg-gradient-to-b from-[#E9D5A0] to-[#C6A55C] bg-clip-text text-transparent">
          {minutes}
        </div>
      </div>
    )
  }

  return (
    <div className="text-[#C6A55C] text-2xl font-bold">
      {time.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </div>
  )
}
