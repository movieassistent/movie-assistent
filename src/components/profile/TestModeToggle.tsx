'use client'

interface TestModeToggleProps {
  value: boolean
  onChange: (value: boolean) => void
}

export default function TestModeToggle({ value, onChange }: TestModeToggleProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Test Modus</label>
      <button
        onClick={() => onChange(!value)}
        className={`px-4 py-2 rounded-lg transition-colors ${
          value
            ? 'bg-[#C6A55C] text-black'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        {value ? 'Aktiviert' : 'Deaktiviert'}
      </button>
    </div>
  )
}
