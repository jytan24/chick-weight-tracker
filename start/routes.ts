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
    router.get('weighings', [controllers.Weighings, 'index'])
    router.get('weighings/create', [controllers.Weighings, 'create'])
    router.post('weighings', [controllers.Weighings, 'store'])
    router
      .get('weighings/:id/edit', [controllers.Weighings, 'edit'])
      .where('id', router.matchers.number())
    router
      .put('weighings/:id', [controllers.Weighings, 'update'])
      .where('id', router.matchers.number())
    router
      .delete('weighings/:id', [controllers.Weighings, 'destroy'])
      .where('id', router.matchers.number())
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
