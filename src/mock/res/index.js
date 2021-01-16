import user from './user'

export default [
  ['get', '/user', user.get],
  ['post', '/user', user.post],
  ['put', '/user', user.post],
  ['delete', '/user', user.delete]
]
