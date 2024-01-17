const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue:DataTypes.UUIDV4,
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false,
            // unique: false,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            //unique: true,
            // validate: {
            //   isEmail: true,
            // },
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          role: {
            type: DataTypes.ENUM('user', 'manager', 'admin'),
            allowNull: false,
            defaultValue: 'user',
          },
        
    })
 return User;   
}