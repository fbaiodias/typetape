const Boom = require('boom')
const SpotifyWebApi = require('spotify-web-api-node')
const config = require('../../config')

const redirectUri = config.url + '/spotify'

let methods = []

function createAuthorizeURL (typeformUrl, playlistName, callback) {
  const typeformId = typeformUrl.match(/\/to\/(......)/)[1]
  const state = `${typeformId}:${playlistName}`

  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: config.spotify.clientId
  })

  const authorizeURL = spotifyApi.createAuthorizeURL(config.spotify.scopes, state)

  callback(null, authorizeURL)
}

function handleCredentials (code, state, callback) {
  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: config.spotify.clientId,
    clientSecret: config.spotify.clientSecret
  })

  const user = {}

  spotifyApi.authorizationCodeGrant(code)
    .then((data) => {
      user.accessToken = data.body.access_token
      user.refreshToken = data.body.refresh_token

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(user.accessToken)
      spotifyApi.setRefreshToken(user.refreshToken)

      return spotifyApi.getMe()
    }).then((data) => {
      user.id = data.body.id
      user.name = data.body.display_name
      user.email = data.body.email

      callback(null, user)
    }).catch((err) => {
      console.log(err)
      callback(Boom.badImplementation('couldn\'t get spotify user'))
    })
}

function createPlaylist (user, state, callback) {
  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    clientId: config.spotify.clientId,
    clientSecret: config.spotify.clientSecret
  })

  const typeform = state.substr(0, state.indexOf(':'))
  const name = state.substr(state.indexOf(':') + 1)

  const playlist = {
    typeform,
    name,
    userId: user.id
  }

  return spotifyApi.createPlaylist(user.id, name)
    .then((data) => {
      console.log(data.body)
      playlist.id = data.body.id
      playlist.url = data.body.external_urls.spotify

      callback(null, playlist)
    }).catch((err) => {
      console.log(err)
      callback(Boom.badImplementation('couldn\'t create spotify playlist'))
    })
}

function addTrack (user, playlist, response, callback) {
  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    clientId: config.spotify.clientId,
    clientSecret: config.spotify.clientSecret
  })

  spotifyApi.searchTracks(response.answers[0].text)
    .then((data) => {
      if (!data.body.tracks.items.length) {
        return callback(Boom.notFound('couldn\'t find track'))
      }

      return spotifyApi.addTracksToPlaylist(user.id, playlist.id, [data.body.tracks.items[0].uri])
    }).then((data) => {
      callback()
    }).catch((err) => {
      console.log(err)
      callback(Boom.badImplementation('couldn\'t find spotify track'))
    })
}

methods.push({ name: 'spotify.createAuthorizeURL', method: createAuthorizeURL })
methods.push({ name: 'spotify.handleCredentials', method: handleCredentials })
methods.push({ name: 'spotify.createPlaylist', method: createPlaylist })
methods.push({ name: 'spotify.addTrack', method: addTrack })

module.exports = methods
