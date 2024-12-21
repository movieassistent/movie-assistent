import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function checkOpenAIBalance(apiKey: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/dashboard/billing/credit_grants', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })
    if (!response.ok) return null
    const data = await response.json()
    return data.total_available
  } catch (error) {
    console.error('Error checking OpenAI balance:', error)
    return null
  }
}

async function checkAnthropicBalance(apiKey: string) {
  // Anthropic doesn't have a direct balance check endpoint
  // This is a placeholder that could be implemented when they add such functionality
  return null
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPERADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const apiKeys = await prisma.apiKey.findMany()
    
    for (const key of apiKeys) {
      let balance = null
      
      if (key.provider === 'openai') {
        balance = await checkOpenAIBalance(key.key)
      } else if (key.provider === 'anthropic') {
        balance = await checkAnthropicBalance(key.key)
      }

      if (balance !== null) {
        await prisma.apiKey.update({
          where: { id: key.id },
          data: { balance }
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating API key balances:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 