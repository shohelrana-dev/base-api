//import controllers
import '@v1/controllers'

import UserService from '@/api/v1/modules/users/user.sevice'
import { Container } from 'inversify'

const container = new Container()

container.bind(UserService).toSelf().inSingletonScope()

export { container }
