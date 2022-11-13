export default () => ({
  DB: {
    DB_CONNECTION: process.env.TYPEORM_CONNECTION || 'postgres',
    DB_HOST: process.env.TYPEORM_HOST || 'localhost',
    DB_PORT: parseInt(process.env.TYPEORM_PORT, 10) || 3306,
    DB_DATABASE: process.env.TYPEORM_DATABASE || 'nest',
    DB_SCHEMA: process.env.TYPEORM_SCHEMA || 'boilerplate',
    DB_USERNAME: process.env.TYPEORM_USERNAME || 'root',
    DB_PASSWORD: process.env.TYPEORM_PASSWORD || 'root',
    DB_LOGGING: process.env.TYPEORM_LOGGING || 'all',
    DB_SYNCHRONIZE: process.env.TYPEORM_SYNCHRONIZE || false,
  },
});
