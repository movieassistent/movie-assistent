import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import OpenAI from 'openai'

async function getOpenAIKey() {
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      provider: 'openai',
      isActive: true
    }
  })
  return apiKey?.key
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKey = await getOpenAIKey()
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not found' }, { status: 400 })
    }

    const openai = new OpenAI({
      apiKey: apiKey
    })

    const params = await context.params
    const ideaId = params.id

    const idea = await prisma.appIdea.findUnique({
      where: { id: ideaId },
      select: {
        title: true,
        description: true,
        category: true,
        status: true,
        priority: true,
        visibility: true
      }
    })

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    const prompt = `Analysiere folgende App-Idee und generiere detaillierte Entwicklungsschritte:

    PROJEKT-DETAILS:
    Titel: ${idea.title}
    Beschreibung: ${idea.description}
    Kategorie: ${idea.category || 'Nicht spezifiziert'}
    Status: ${idea.status}
    Priorität: ${idea.priority}/5
    Sichtbarkeit: ${idea.visibility}
    
    ANFORDERUNGEN:
    1. Generiere 5-7 konkrete Entwicklungsschritte
    2. Jeder Schritt soll spezifisch und technisch umsetzbar sein
    3. Die Schritte sollen in logischer Reihenfolge sein
    4. Für jeden Schritt soll ein detailliertes KI-Prompt erstellt werden
    
    Formatiere die Antwort als JSON-Array mit Objekten, die folgende Struktur haben:
    {
      "title": "Name des Entwicklungsschritts",
      "description": "Detaillierte Beschreibung der Aufgabe",
      "prompt": "Ein spezifisches KI-Prompt für diesen Entwicklungsschritt, das für weitere Detailplanung verwendet werden kann"
    }
    
    Gib NUR das JSON-Array zurück, keine weiteren Erklärungen.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "Du bist ein erfahrener Softwareentwickler und Softwarearchitekt, der App-Ideen in konkrete, technische Entwicklungsschritte unterteilt. Deine Antworten sind präzise, technisch fundiert und praxisorientiert. Antworte ausschließlich mit einem validen JSON-Array." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
    })

    const response = completion.choices[0].message.content
    if (!response) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 })
    }

    let subtasks
    try {
      subtasks = JSON.parse(response.trim())
      if (!Array.isArray(subtasks)) {
        throw new Error('Response is not an array')
      }
    } catch (error) {
      console.error('Failed to parse OpenAI response:', response)
      return NextResponse.json({ 
        error: 'Invalid response format from OpenAI',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }
    
    // Speichere die generierten Unterpunkte in der Datenbank
    const updatedIdea = await prisma.appIdea.update({
      where: { id: ideaId },
      data: {
        subtasks: {
          create: subtasks.map((task: any, index: number) => ({
            title: task.title || 'Untitled Task',
            description: task.description || null,
            aiPrompt: task.prompt || null,
            completed: false,
            order: index,
            isAiGenerated: true
          }))
        }
      },
      include: {
        subtasks: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json(updatedIdea)
  } catch (error) {
    console.error('Error generating subtasks:', error instanceof Error ? error.message : error)
    return NextResponse.json({ 
      error: 'Error generating subtasks',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 