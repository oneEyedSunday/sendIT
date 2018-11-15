// import { pool } from '.';
import dbHelpers from './helpers';

process.env.NODE_ENV = 'test';

// pool.connect();

// pool.on('connect', () => {
//   console.log('connected to the TEST db');
// });

/*
const createTables = () => {
  const userTableQuery = `CREATE TABLE IF NOT EXISTS
          users(
            id UUID PRIMARY KEY,
            email VARCHAR(125) NOT NULL,
            firstname VARCHAR(20) NOT NULL,
            lastname VARCHAR(20) NOT NULL,
            password VARCHAR(70) NOT NULL,
            admin BOOLEAN DEFAULT FALSE,
            created_date TIMESTAMP,
            modified_date TIMESTAMP
          )
    `;
  pool.query(userTableQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};
*/

// eslint-disable-next-line no-unused-vars
/*
const dropTables = () => {
  const queryText = 'DROP TABLE IF EXISTS reflections';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};
*/

// createTables();

dbHelpers.createUser({
  email: 'test@sendIt.com',
  firstname: 'Test',
  lastname: 'Admin',
  password: 'someHAsh',
}).then(result => console.log(result)).catch(err => console.error('ERR', err));

/*
pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});
*/
