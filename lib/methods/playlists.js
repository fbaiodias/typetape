const Boom = require('boom')
const { Playlist } = require('../models')

let methods = []

function get (id, callback) {
  Playlist.findById(id)
    .then(result => result ? callback(result.toJSON()) : callback(Boom.notFound('playlist not found')))
    .catch((err) => {
      console.error({ err: err }, 'error getting playlist')
      callback(Boom.internal())
    })
}

function getByTypeform (typeform, callback) {
  Playlist.findOne({ typeform })
    .then(result => result ? callback(result.toJSON()) : callback(Boom.notFound('playlist not found')))
    .catch((err) => {
      console.error({ err: err }, 'error getting playlist')
      callback(Boom.internal())
    })
}

function create (playlist, callback) {
  Playlist.create(playlist)
    .then(result => callback(result.toJSON()))
    .catch((err) => {
      console.error({ err: err.errors }, 'error creating playlist')
      callback(Boom.badImplementation('error creating playlist'))
    })
}

methods.push({ name: 'playlists.get', method: get })
methods.push({ name: 'playlists.getByTypeform', method: getByTypeform })
methods.push({ name: 'playlists.create', method: create })

module.exports = methods
