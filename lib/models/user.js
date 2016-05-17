module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: { primaryKey: true, type: DataTypes.STRING },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING
  })
}
