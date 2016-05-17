'use strict'

const Joi = require('joi')
const config = require('../../config')

const routes = []

routes.push({
  method: 'POST',
  path: '/',
  config: {
    tags: ['api'],
    validate: {
      payload: Joi.object().keys({
        form_response: Joi.object().keys({
          form_id: Joi.string().required(),
          submitted_at: Joi.string().required(),
          answers: Joi.array()
        }).unknown().required()
      }).unknown()
    },
    pre: [
      { method: 'responses.create(payload.form_response)', assign: 'response' },
      { method: 'playlists.getByTypeform(pre.response.form_id)', assign: 'playlist' },
      { method: 'users.get(pre.playlist.userId)', assign: 'user' },
      { method: 'spotify.addTrack(pre.user, pre.playlist, pre.response)' }
    ],
    handler: function (request, reply) {
      reply()
    },
    description: 'Typeform webhook endpoint'
  }
})

routes.push({
  method: 'GET',
  path: '/',
  config: {
    tags: ['api'],
    handler: function (request, reply) {
      reply.redirect(config.typeforms.new)
    },
    description: 'Returns new typeform'
  }
})

routes.push({
  method: 'GET',
  path: '/new',
  config: {
    tags: ['api'],
    validate: {
      query: Joi.object().keys({
        typeformUrl: Joi.string().required(),
        playlistName: Joi.string().required()
      }).unknown()
    },
    pre: [
      { method: 'spotify.createAuthorizeURL(query.typeformUrl, query.playlistName)', assign: 'authorizeURL' }
    ],
    handler: function (request, reply) {
      reply.redirect(request.pre.authorizeURL)
    },
    description: 'Redirects the user to a spotify auth url'
  }
})

routes.push({
  method: 'GET',
  path: '/spotify',
  config: {
    tags: ['api'],
    validate: {
      query: Joi.object().keys({
        code: Joi.string().required(),
        state: Joi.string().required()
      }).unknown()
    },
    pre: [
      { method: 'spotify.handleCredentials(query.code, query.state)', assign: 'user' },
      { method: 'users.upsert(pre.user)', assign: 'user' },
      { method: 'spotify.createPlaylist(pre.user, query.state)', assign: 'playlist' },
      { method: 'playlists.create(pre.playlist)', assign: 'playlist' }
    ],
    handler: function (request, reply) {
      reply.redirect(request.pre.playlist.url)
    },
    description: 'Spotify auth callback'
  }
})

module.exports = routes
