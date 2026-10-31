/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { throttleLogin } from '#start/limiter'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', ({ response }) => response.redirect().toRoute('weighings.index')).as('home')

router
  .group(() => {
    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store']).use(throttleLogin)
  })
  .use(middleware.guest())

router
  .group(() => {
    router.on('/weighings').renderInertia('weighings/index', {}).as('weighings.index')
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
