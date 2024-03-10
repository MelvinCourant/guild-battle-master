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

router.group(() => {
  const authController = new AuthController()

  router.post('/login', async () => {
    return authController.login()
  })

  router.post('/register/:step', async (data) => {
    return authController.register(data)
  })
}).prefix('api/auth')
