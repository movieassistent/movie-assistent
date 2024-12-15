'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useSettings } from '@/providers/SettingsProvider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function ProfilePage() {
  const { data: session } = useSession()
  const { settings, updateSettings } = useSettings()

  const handleChange = async (value: string) => {
    try {
      await updateSettings({ sidebarPosition: value })
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A]">
      <div className="w-full max-w-4xl p-8 space-y-8">
        <h1 className="text-2xl font-bold text-[#C6A55C]">Profil</h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[#C6A55C]">E-Mail</Label>
            <p className="text-gray-400">{session?.user?.email}</p>
          </div>

          <div className="space-y-4">
            <Label className="text-[#C6A55C]">Sidebar Position</Label>
            <RadioGroup
              defaultValue={settings.sidebarPosition || 'links'}
              onValueChange={handleChange}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="links"
                  id="links"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="links"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#C6A55C] [&:has([data-state=checked])]:border-[#C6A55C]"
                >
                  Links
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="rechts"
                  id="rechts"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="rechts"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#C6A55C] [&:has([data-state=checked])]:border-[#C6A55C]"
                >
                  Rechts
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="oben"
                  id="oben"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="oben"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#C6A55C] [&:has([data-state=checked])]:border-[#C6A55C]"
                >
                  Oben
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="unten"
                  id="unten"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="unten"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#C6A55C] [&:has([data-state=checked])]:border-[#C6A55C]"
                >
                  Unten
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  )
}
