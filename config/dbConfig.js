module.exports = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: '',
    DB: 'mycliente2db',
    dialect: 'mysql',
    dialectOptions: {
        useUTC: false,
    },
    timezone: '-05:00',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
}