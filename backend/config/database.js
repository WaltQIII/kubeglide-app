// at backend/config/database.js
const path = require('path');

module.exports = ({ env }) => {
  // This is for the SQLite database
  if (env('NODE_ENV') === 'development') {
    return {
      connection: {
        client: 'sqlite',
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    };
  }

  // This is for our Production/Docker PostgreSQL database
  // It will read the variables from docker-compose.yml
  return {
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST'),
        port: env.int('DATABASE_PORT'),
        database: env('DATABASE_NAME'),
        user: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
  };
};