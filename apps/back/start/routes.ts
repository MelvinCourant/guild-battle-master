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
import GuildsController from "#controllers/guilds_controller";
import MembersController from "#controllers/members_controller";
import MonstersController from "#controllers/monsters_controller";
import BoxesController from "#controllers/boxes_controller";
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

router.group(() => {
  router.get('/:filename', async ({params, response}) => {
    const {filename} = params
    response.download(app.makePath('uploads', filename))
  })

  router.get('/monsters/:filename', async ({params, response}) => {
    const {filename} = params
    response.download(app.makePath('uploads/monsters', filename))
  })
}).prefix('uploads')

router.group(() => {
  const guildsController = new GuildsController()

  router.get('/:id', async (data) => {
    return guildsController.show(data)
  })

  router.put('/', async (data) => {
    return guildsController.create(data)
  });

  router.get('/:id/members/:keyword', async (data) => {
    return guildsController.search(data)
  })
}).prefix('api/guilds')

router.group(() => {
  const membersController = new MembersController()

  router.patch('/:id', async (data) => {
    return membersController.update(data)
  })

  router.patch('/:id/exclude', async (data) => {
    return membersController.destroy(data)
  });
}).prefix('api/members')

router.group(() => {
  const monstersController = new MonstersController()

  router.put('/', async (data) => {
    return monstersController.create(data)
  });

  router.get('/:id', async (data) => {
    return monstersController.show(data)
  });
}).prefix('api/monsters')

router.group(() => {
  const boxesController = new BoxesController()

  router.put('/:memberId', async (data) => {
    return boxesController.create(data)
  });
}).prefix('api/boxes')
