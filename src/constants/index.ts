// App constants

export const APP_NAME = 'BookLove'
export const APP_DESCRIPTION = 'Swipe right on your next book boyfriend'

// Route paths
export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  CHAT_LOG: '/chat-log',
  BOOTYCALL: '/bootycall',
} as const

// Status labels for issue workflow
export const LABELS = {
  NEEDS_REVIEW: 'needs-review',
  READY: 'ready',
  IN_PROGRESS: 'in-progress',
  IN_REVIEW: 'in-review',
  QA: 'qa',
} as const
