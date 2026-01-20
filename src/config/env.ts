import * as dotenv from "dotenv"
import { resolve } from "path";
type EnvConfig = {
    NODE_ENV: string
    PORT: number
    MONGO_URL: string
    SALT: number
    JWT_SECRET: string
    JWT_EXPIRY: number
};

dotenv.config({
    path: resolve(process.cwd(), '.env.local')
})

function getEnv(name: string): string {
    const value = process.env[name]
    if (value === undefined || value === '') {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

function getNumberEnv(name: string): number {
    const value = getEnv(name)
    const num = Number(value)

    if (Number.isNaN(num)) {
        throw new Error(`Environment variable ${name} must be a number`)
    }

    return num
}

export const env: EnvConfig = {
    NODE_ENV: getEnv('NODE_ENV'),
    PORT: getNumberEnv('PORT'),
    MONGO_URL: getEnv('MONGO_URL'),
    SALT: getNumberEnv('SALT'),
    JWT_SECRET: getEnv('JWT_SECRET'),
    JWT_EXPIRY: getNumberEnv('JWT_EXPIRY')
};