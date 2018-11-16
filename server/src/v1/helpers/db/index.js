import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Returns a pool object
 * @returns {pool}
 */
const createPool = () => {
  let poolObj = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  };

  if (process.env.DATABASE_URL) poolObj = { connectionString: process.env.DATABASE_URL };
  // console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'test') poolObj.database = process.env.DB_NAME_TEST;

  // console.log(poolObj);
  return new Pool(poolObj);
};

export const pool = createPool();

const DB = {
  /**
 * Returns a promise of a query
 * @param {string} text
 * @param {array} params
 * @returns {promise}
 */
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  /**
 * Returns a pool object
 * @returns {pool}
 */
  pool() {
    return pool;
  },
  /**
 * Returns a pool object
 * @returns {pool}
 */
  createPool() {
    return createPool();
  },
};

export default DB;
