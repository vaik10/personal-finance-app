import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),

  db: {
    client: process.env.DB_CLIENT ?? 'sqlite3',
    file: process.env.DB_FILE ?? './data/db.sqlite3',
  },
};