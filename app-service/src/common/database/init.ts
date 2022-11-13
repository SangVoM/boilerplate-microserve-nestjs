import { Pool } from 'pg';
import * as dotenv from 'dotenv';

async function initSchema() {
  dotenv.config();
  const pool = new Pool({
    user: process.env.TYPEORM_USERNAME,
    host: process.env.TYPEORM_HOST,
    database: process.env.TYPEORM_DATABASE,
    password: process.env.TYPEORM_PASSWORD,
    port: parseInt(process.env.TYPEORM_PORT),
  });
  return new Promise<any>((resolve: any, reject: any) => {
    pool.query(
      `CREATE SCHEMA IF NOT EXISTS ${process.env.TYPEORM_SCHEMA};`,
      (err) => {
        pool.end();
        if (err) {
          reject(err);
        }
        resolve(`Create success schema '${process.env.TYPEORM_SCHEMA}'`);
      },
    );
  });
}

(async () => {
  await initSchema();
})();
