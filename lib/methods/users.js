const Boom = require('boom')
const { User } = require('../models')

let methods = []

function get (id, callback) {
  User.findById(id)
    .then(result => result ? callback(result.toJSON()) : callback(Boom.notFound('user not found')))
    .catch((err) => {
      console.error({ err: err }, 'error getting user')
      callback(Boom.internal())
    })
}

function upsert (user, callback) {
  User.findOrCreate({ where: { id: user.id }, defaults: user })
    .spread(result => callback(result.toJSON()))
    .catch((err) => {
      console.error({ err: err }, 'error creating user')
      callback(Boom.internal())
    })
}

methods.push({ name: 'users.get', method: get })
methods.push({ name: 'users.upsert', method: upsert })

module.exports = methods
