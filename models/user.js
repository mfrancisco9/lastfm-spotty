const { Model, DataTypes} = require ('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require ('bcrypt');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            trim: true,
            allowNull: false
        },
            password: {
                type: DataTypes.STRING,
                trim: true,
                allowNull: false,
            },
            lastfm_username: {
                type: DataTypes.STRING,
                trim: true,
                allownull: true,
            },
            lastfm_sessionkey: {
                type: DataTypes.STRING,
                trim: true,
                allowNull: true,
            },
            artist_picks: {
                type: DataTypes.STRING,
                allowNull: true,
                get: function() {
                    const rawValue = this.getDataValue('artist_picks')
                    return rawValue ? rawValue.split(';') : null;
                },
                set: function (val) {
                    this.setDataValue('artist_picks', val.join(';'));
                }
            }
        
    },
    {
        hooks: {
            beforeCreate: async (newArtistData) => {
                newArtistData.password = await bcrypt.hash(newArtistData.password, 10);
                console.log(newArtistData)
                return newArtistData;
            },
            beforeUpdate: async (updatedArtistData) => {
                updatedArtistData.password = await bcrypt.hash(updatedArtistData.password, 10);
                return updatedArtistData;
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
    }
)

module.exports = User;