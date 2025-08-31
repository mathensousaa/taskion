export const { NODE_ENV } = process.env
export const URL = process.env.NEXT_PUBLIC_URL

export const IS_DEVELOPMENT = NODE_ENV === 'development'
export const IS_TEST = NODE_ENV === 'test'
export const IS_PRODUCTION = NODE_ENV === 'production'

export const API_URL = process.env.API_URL
export const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL
export const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN

export const SUPABASE_URL = process.env.SUPABASE_URL
export const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY

export const N8N_BASE_URL = process.env.N8N_BASE_URL
export const N8N_WEBHOOK_PATH = process.env.N8N_WEBHOOK_PATH
export const N8N_WEBHOOK_TOKEN = process.env.N8N_WEBHOOK_TOKEN
export const N8N_WEBHOOK_AUTH_HEADER = process.env.N8N_WEBHOOK_AUTH_HEADER

export const TASK_ENHANCER_SECRET = process.env.TASK_ENHANCER_SECRET
