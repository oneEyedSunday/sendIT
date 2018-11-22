/* eslint-disable no-console */
import dontenv from 'dotenv';
import { pool } from '.';

// process.env.NODE_ENV = 'heroku';
dontenv.config();

// console.log(process.env.NODE_ENV);
// console.log(pool);
// process.env.NODE_ENV = 'test';

// pool.connect();

// pool.on('connect', () => {
//   console.log('connected to the TEST db');
// });

const createUsersTable = () => {
  const userTableQuery = `CREATE TABLE IF NOT EXISTS
          users(
            id UUID PRIMARY KEY,
            email VARCHAR(125) UNIQUE NOT NULL,
            firstname VARCHAR(20) NOT NULL,
            lastname VARCHAR(20) NOT NULL,
            password VARCHAR(70) NOT NULL,
            admin BOOLEAN DEFAULT FALSE,
            created_date TIMESTAMP,
            modified_date TIMESTAMP
          )
    `;
  return pool.query(userTableQuery);
};

const createParcelsTable = () => {
  const parcelTableQuery = `CREATE TABLE IF NOT EXISTS
          parcels(
            id UUID PRIMARY KEY,
            userId UUID NOT NULL,
            destination VARCHAR(125) NOT NULL,
            presentLocation VARCHAR(20) NOT NULL,
            pickUpLocation VARCHAR(125) NOT NULL,
            price VARCHAR(10) NOT NULL,
            status INTEGER NOT NULL,
            created_date TIMESTAMP,
            modified_date TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
          )
    `;
  return pool.query(parcelTableQuery);
};

// eslint-disable-next-line no-unused-vars

const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  return pool.query(queryText);
};

const dropParcelsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS parcels';
  return pool.query(queryText);
};

/**
 * Create All Tables in DB
 * @function
 * @returns {null} null
 * Create All Tables
 */
const createAllTables = () => createUsersTable().then(() => {
  // console.log(resultOne);
  console.log('successfully created users table');
  return createParcelsTable().then(() => {
    // console.log(resultTwo);
    console.log('successfully created Parcels table');
  }).catch((errorTwo) => {
    console.error('error creating parcels table', errorTwo);
  });
}).catch((errOne) => {
  console.error('error creating users table', errOne);
});

/**
 * Drop All Tables in DB
 * @function
 * @returns {null} null
 * Drop All Tables
 */
const dropAllTables = () => dropParcelsTable().then(() => {
  // console.log(resultOne);
  console.log('successfully dropped parcels table');
  return dropUsersTable().then(() => {
    // console.log(resultTwo);
    console.log('successfully dropped users table');
  }).catch((errTwo) => {
    console.error('error dropping users table', errTwo);
  });
}).catch((errOne) => {
  console.error('error dropping parcels table', errOne);
});

// select count(*) from pg_catalog.pg_database where datname = 'test' ;
// create db if not exists

dropAllTables().then((res) => {
  console.log(res);
  console.log('Attempting to create tables');
  createAllTables().then((result) => {
    console.log(result);
    pool.end();
  }).catch((error) => {
    console.error(error);
    pool.end();
  });
})
  .catch((err) => {
    console.log(err);
    pool.end();
  });


// createAllTables();

/*
dbHelpers.createUser({
  email: 'test@sendIt.com',
  firstname: 'Test',
  lastname: 'Admin',
  password: 'someHAsh',
}).then((result) => {
  dbHelpers.createParcel({
    userId: result.id,
    destination: 'Ikorodu',
    presentLocation: 'Ojota',
    pickUpLocation: 'Oshodi',
    price: 'N500',
    status: 0,
  })
    .then(resultTwo => console.log(resultTwo))
    .catch(error => console.error(error));
}).catch(err => console.error('ERR', err));
*/

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});
