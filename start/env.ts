/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Node
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  // App
  APP_KEY: Env.schema.secret(),

  // Session
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  // Limiter
  LIMITER_STORE: Env.schema.enum(['memory'] as const),

  // Database
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  // Required when running for real, so a live site can never start without a database password
  DB_PASSWORD:
    process.env.NODE_ENV === 'production' ? Env.schema.string() : Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
  // Neon (and most hosted databases) only accept encrypted connections
  DB_SSL: Env.schema.boolean.optional(),

  // How many proxies sit in front of the app (Render uses 1), so we see each visitor's real address
  TRUST_PROXY_HOPS: Env.schema.number.optional(),
})
