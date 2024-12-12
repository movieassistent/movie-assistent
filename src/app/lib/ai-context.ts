export const projectContext = {
  version: '1.0.0',
  lastUpdate: '2024-03-21',
  
  architecture: {
    frontend: {
      framework: 'Next.js 14',
      styling: 'Tailwind CSS',
      state: {
        theme: 'ThemeProvider',
        language: 'LanguageProvider',
        auth: 'NextAuth.js'
      }
    },
    backend: {
      database: 'PostgreSQL',
      orm: 'Prisma',
      auth: 'NextAuth.js'
    }
  },

  designSystem: {
    colors: {
      primary: 'Gold gradient',
      background: 'Dark theme',
      text: 'White/Gold'
    },
    components: {
      buttons: 'Rounded with gradient',
      text: 'Animated shimmer effect',
      layout: 'Responsive with mobile-first'
    }
  },

  currentFocus: {
    priority1: 'Landing page optimization',
    priority2: '2FA implementation',
    priority3: 'German translation'
  },

  aiInstructions: {
    codeStyle: 'Clean, modular, well-commented',
    designPreference: 'Cinematic, premium feel',
    languageHandling: 'Support for DE/EN with easy expansion'
  }
} 