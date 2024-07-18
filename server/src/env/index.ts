import { z } from "zod"
import { config } from "dotenv"

const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  JWT_SIGNING_KEY: z.string(),
  JWT_EXPIRY: z.string(),
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  GOOGLE_OAUTH_REDIRECT_URI: z.string(),
  COOKIE_SECRET: z.string(),
})

export const parseEnv = (): void => {
  config()
  envSchema.parse(process.env)
}

const getEnvVar = (key: keyof z.infer<typeof envSchema>): string => {
  return process.env[key] as string
}

export default getEnvVar
