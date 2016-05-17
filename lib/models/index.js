const Sequelize = require('sequelize')
const path = require('path')
const config = require('../../config')

const sequelize = new Sequelize(config.sequelize.url, {
  dialect: 'postgres',
  protocol: 'postgres'
})

sequelize.sync({ force: false })

const Response = sequelize.import(path.join(__dirname, '/response'))
const Playlist = sequelize.import(path.join(__dirname, '/playlist'))
const User = sequelize.import(path.join(__dirname, '/user'))

User.hasMany(Playlist, { as: 'Playlists', foreignKey: 'userId' })

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  Response,
  Playlist,
  User
}
