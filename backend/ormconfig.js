module.exports = {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: false,
    logging: true,
    entities: ['dist/src/storages/mysql/**/*Entity.js'],
    migrations: ['dist/mysql-migration/**/*.js'],
    cli: {
        entitiesDir: 'src/storages/mysql',
        migrationsDir: 'mysql-migration',
    },
};
