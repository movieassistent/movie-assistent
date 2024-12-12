'use client'

interface StartSettingsProps {
  value: string
  onChange: (value: string) => void
}

export default function StartSettings({ value, onChange }: StartSettingsProps) {
  const options = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'lastVisited', label: 'Letzte Seite' }
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Startseite
      </label>
      <div className="flex gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              value === option.id
                ? 'bg-[#C6A55C] text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
