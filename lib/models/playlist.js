module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Playlist', {
    id: { primaryKey: true, type: DataTypes.STRING },
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    typeform: DataTypes.STRING
  })
}
