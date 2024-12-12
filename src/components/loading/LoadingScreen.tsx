'use client'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#141414] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#C6A55C] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#C6A55C] text-lg">Laden...</p>
      </div>
    </div>
  )
}
