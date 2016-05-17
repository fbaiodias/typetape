const responses = require('./responses')
const spotify = require('./spotify')
const users = require('./users')
const playlists = require('./playlists')

let methods = []

methods = methods.concat(responses)
methods = methods.concat(spotify)
methods = methods.concat(users)
methods = methods.concat(playlists)

module.exports = methods
