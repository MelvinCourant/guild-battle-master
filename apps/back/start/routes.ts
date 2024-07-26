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
import UsersController from '#controllers/users_controller'
import GuildsController from '#controllers/guilds_controller'
import MembersController from '#controllers/members_controller'
import MonstersController from '#controllers/monsters_controller'
import BoxesController from '#controllers/boxes_controller'
import CompositionsController from '#controllers/compositions_controller'
import NotificationsController from '#controllers/notifications_controller'
import TowersController from '#controllers/towers_controller'
import DefensesController from '#controllers/defenses_controller'
import ResetPasswordController from '#controllers/reset_password_controller'
import AdminController from '#controllers/admin_controller'
import app from '@adonisjs/core/services/app'

router
  .group(() => {
    const usersController = new UsersController()

    router.get('/verify', async (data) => {
      return usersController.verify(data)
    })

    router.patch('/bequeath-leader', async (data) => {
      return usersController.bequeathLeader(data)
    })

    router.patch('/update-profile', async (data) => {
      return usersController.updateProfile(data)
    })
  })
  .prefix('api/users')

router
  .group(() => {
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
  })
  .prefix('api/auth')

router
  .group(() => {
    router.get('/:filename', async ({ params, response }) => {
      const { filename } = params
      response.download(app.makePath('uploads', filename))
    })

    router.get('/monsters/:filename', async ({ params, response }) => {
      const { filename } = params
      response.download(app.makePath('uploads/monsters', filename))
    })
  })
  .prefix('uploads')

router
  .group(() => {
    const guildsController = new GuildsController()

    router.get('/:id', async (data) => {
      return guildsController.show(data)
    })

    router.put('/', async (data) => {
      return guildsController.create(data)
    })

    router.post('/:id/members', async (data) => {
      return guildsController.search(data)
    })
  })
  .prefix('api/guilds')

router
  .group(() => {
    const membersController = new MembersController()

    router.get('/:id', async (data) => {
      return membersController.show(data)
    })

    router.get('/:id/verify-upload-permissions', async (data) => {
      return membersController.verifyUploadPermissions(data)
    })

    router.patch('/:id', async (data) => {
      return membersController.update(data)
    })

    router.put('/:id', async (data) => {
      return membersController.store(data)
    })

    router.patch('/:id/exclude', async (data) => {
      return membersController.destroy(data)
    })
  })
  .prefix('api/members')

router
  .group(() => {
    const monstersController = new MonstersController()

    router.put('/', async (data) => {
      return monstersController.create(data)
    })

    router.get('/:id', async (data) => {
      return monstersController.show(data)
    })

    router.post('/', async (data) => {
      return monstersController.list(data)
    })
  })
  .prefix('api/monsters')

router
  .group(() => {
    const boxesController = new BoxesController()

    router.put('/:memberId', async (data) => {
      return boxesController.create(data)
    })

    router.post('/:memberId/search', async (data) => {
      return boxesController.search(data)
    })

    router.post('/:guildId/search-compositions', async (data) => {
      return boxesController.compositions(data)
    })
  })
  .prefix('api/boxes')

router
  .group(() => {
    const compositionsController = new CompositionsController()

    router.post('/', async (data) => {
      return compositionsController.create(data)
    })

    router.delete('/:id', async (data) => {
      return compositionsController.destroy(data)
    })

    router.post('/:guildId/search', async (data) => {
      return compositionsController.search(data)
    })

    router.put('/:id', async (data) => {
      return compositionsController.update(data)
    })

    router.get('/:id', async (data) => {
      return compositionsController.show(data)
    })
  })
  .prefix('api/compositions')

router
  .group(() => {
    const notificationsController = new NotificationsController()

    router.get('/', async (data) => {
      return notificationsController.list(data)
    })

    router.delete('/:id', async (data) => {
      return notificationsController.destroy(data)
    })

    router.patch('/:id', async (data) => {
      return notificationsController.update(data)
    })
  })
  .prefix('api/notifications')

router
  .group(() => {
    const towersController = new TowersController()

    router.get('/:id/show', async (data) => {
      return towersController.show(data)
    })

    router.get('/list', async (data) => {
      return towersController.list(data)
    })

    router.put('/:id/update', async (data) => {
      return towersController.update(data)
    })

    router.delete('/reset', async (data) => {
      return towersController.destroy(data)
    })

    router.get('/defenses-per-member', async (data) => {
      return towersController.defensesPerMember(data)
    })
  })
  .prefix('api/towers')

router
  .group(() => {
    const defensesController = new DefensesController()

    router.get('/', async (data) => {
      return defensesController.list(data)
    })
  })
  .prefix('api/defenses')

const resetPasswordController = new ResetPasswordController()

router.post('/api/forgot-password', async (data) => {
  return resetPasswordController.forgotPassword(data)
})

router.get('/api/reset-password', async (data) => {
  return resetPasswordController.verifyUrl(data)
})

router.post('/api/reset-password', async (data) => {
  return resetPasswordController.resetPassword(data)
})

router
  .group(() => {
    const adminController = new AdminController()

    router.get('/list-guilds', async (data) => {
      return adminController.listGuilds(data)
    })
  })
  .prefix('api/admin')
