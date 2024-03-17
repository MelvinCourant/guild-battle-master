/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import MembersController from "#controllers/members_controller";
import GuildsController from "#controllers/guilds_controller";
import app from '@adonisjs/core/services/app'

router.group(() => {
  const authController = new AuthController()

  router.post('/login', async (data) => {
    return authController.login(data)
  })

  router.post('/register/:step', async (data) => {
    return authController.register(data)
  })

  router.post('/logout', async (data) => {
    return authController.logout(data)
  })
}).prefix('api/auth')

router.get('/uploads/:filename', async ({ params, response }) => {
  const { filename } = params
  response.download(app.makePath('uploads', filename))
})

router.group(() => {
  const guildsController = new GuildsController()

  router.get('/guild/:id', async (data) => {
    return guildsController.show(data)
  })
}).prefix('api')
