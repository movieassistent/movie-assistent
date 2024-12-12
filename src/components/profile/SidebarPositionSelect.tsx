'use client'

interface SidebarPositionSelectProps {
  value: string
  onChange: (value: string) => void
}

export default function SidebarPositionSelect({ value, onChange }: SidebarPositionSelectProps) {
  const positions = [
    { id: 'left', label: 'Links' },
    { id: 'right', label: 'Rechts' }
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Sidebar Position
      </label>
      <div className="flex gap-4">
        {positions.map((position) => (
          <button
            key={position.id}
            onClick={() => onChange(position.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              value === position.id
                ? 'bg-[#C6A55C] text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {position.label}
          </button>
        ))}
      </div>
    </div>
  )
}
