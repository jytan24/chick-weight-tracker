import env from '#start/env'
import { defineConfig, stores } from '@adonisjs/limiter'
import type { InferLimiters } from '@adonisjs/limiter/types'

const limiterConfig = defineConfig({
  default: env.get('LIMITER_STORE'),

  stores: {
    /**
     * Memory store keeps the attempt counts in the server's memory.
     * It is enough for a single server. The counts reset when the
     * server restarts.
     */
    memory: stores.memory({}),
  },
})

export default limiterConfig

declare module '@adonisjs/limiter/types' {
  export interface LimitersList extends InferLimiters<typeof limiterConfig> {}
}
