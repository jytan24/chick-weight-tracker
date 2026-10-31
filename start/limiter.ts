/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes.
|
*/

import limiter from '@adonisjs/limiter/services/main'

/**
 * Only 10 login attempts per 15 minutes from the same address, so
 * nobody can guess the password by trying again and again.
 */
export const throttleLogin = limiter.define('login', () => {
  return limiter.allowRequests(10).every('15 minutes')
})
