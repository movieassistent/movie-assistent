import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'

interface AIGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
}

interface GenerationStep {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  message?: string
}

export default function AIGenerationModal({
  isOpen,
  onClose,
  title
}: AIGenerationModalProps) {
  const [steps, setSteps] = useState<GenerationStep[]>([
    {
      id: 'analyze',
      title: 'Analysiere Idee',
      status: 'pending'
    },
    {
      id: 'generate',
      title: 'Generiere Unterpunkte',
      status: 'pending'
    },
    {
      id: 'refine',
      title: 'Verfeinere Ergebnisse',
      status: 'pending'
    }
  ])

  useEffect(() => {
    if (isOpen) {
      // Simuliere den Generierungsprozess
      const simulateStep = async (index: number) => {
        setSteps(prev => prev.map((step, i) => 
          i === index ? { ...step, status: 'in_progress' } : step
        ))

        await new Promise(resolve => setTimeout(resolve, 2000))

        setSteps(prev => prev.map((step, i) => 
          i === index ? { ...step, status: 'completed' } : step
        ))

        if (index < steps.length - 1) {
          simulateStep(index + 1)
        }
      }

      simulateStep(0)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault()
          onClose()
        }
      }}
    >
      <div 
        className="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-2xl mx-4 border border-[#C6A55C]/20"
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#C6A55C]">KI-Generierung für "{title}"</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Fortschrittsanzeige */}
          <div className="relative">
            <div className="absolute left-4 h-full w-0.5 bg-[#C6A55C]/20" />
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.id} className="relative pl-12">
                  <div className={`absolute left-3 w-3 h-3 rounded-full border-2 ${
                    step.status === 'completed' ? 'bg-green-500 border-green-500' :
                    step.status === 'in_progress' ? 'bg-[#C6A55C] border-[#C6A55C] animate-pulse' :
                    step.status === 'error' ? 'bg-red-500 border-red-500' :
                    'border-[#C6A55C] bg-[#1A1A1A]'
                  }`} />
                  <div className="flex items-center space-x-3">
                    <span className={`font-medium ${
                      step.status === 'completed' ? 'text-green-500' :
                      step.status === 'in_progress' ? 'text-[#C6A55C]' :
                      step.status === 'error' ? 'text-red-500' :
                      'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                    {step.status === 'in_progress' && (
                      <Loader2 className="w-4 h-4 text-[#C6A55C] animate-spin" />
                    )}
                  </div>
                  {step.message && (
                    <p className="text-sm text-gray-400 mt-1">{step.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Generierte Unterpunkte werden hier angezeigt */}
          <div className="mt-8">
            {steps[steps.length - 1].status === 'completed' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-[#C6A55C]">Generierte Unterpunkte</h3>
                <div className="space-y-2 animate-fade-in">
                  {/* Hier werden die generierten Unterpunkte angezeigt */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 