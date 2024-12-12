import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Test the connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    return NextResponse.json({
      status: 'success',
      message: 'Connected to database successfully',
      result
    })

  } catch (error) {
    // Log the actual error for debugging
    if (error instanceof Error) {
      console.error('Database connection error:', error.message)
    }
    
    // Return a sanitized error response
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to database',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
} 