const pack = require('./package')

const config = {
  url: process.env.URL || 'https://typetape.localtunnel.me'
}

config.typeforms = {
  new: `https://xicombd.typeform.com/to/ARfmtK?url=${config.url.replace(/https?:\/\//, '')}`,
  error: `https://xicombd.typeform.com/to/FKsJAw?url=${config.url.replace(/https?:\/\//, '')}`,
}

config.hapi = {
  port: process.env.PORT || 8000
}

config.sequelize = {
  url: process.env.DATABASE_URL || 'postgres:///typetape'
}

config.swagger = {
  basePath: config.url,
  info: {
    title: pack.name,
    description: pack.description
  }
}

config.spotify = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  scopes: ['playlist-modify-public', 'playlist-modify-private', 'user-read-email']
}

module.exports = config
