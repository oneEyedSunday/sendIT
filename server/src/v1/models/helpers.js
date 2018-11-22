import uuidv4 from 'uuid/v4';
import db from '.';

/**
 * Function to return singular form of table name
 * @function
 * @param {string} tablename - Tablename
 * @return {string} Singular form of tablename
 */
const singularTableName = (tablename) => {
  const firstLetter = tablename.charAt(0).toUpperCase();
  const singular = tablename.substr(0, tablename.length - 1);
  return firstLetter.concat(singular.slice(1));
};

/**
 * Helper Class containing functions for DB Queries.
 * @type {object}
 * @const
 * @namespace DBHelper
 */
export default class DBHelper {
  /**
 * Function to create a user in DB
 * @function
 * @param {object} userObject - Object containing user data
 * @return {object} created User
 */
  static async createUser(userObject) {
    const text = `INSERT INTO
          users(id, email, firstname, lastname, password, admin, created_date, modified_date)
          VALUES($1, $2, $3, $4, $5, $6, NOW(), NOW())
          returning *`;
    const values = [
      uuidv4(),
      userObject.email,
      userObject.firstname,
      userObject.lastname,
      userObject.password,
      userObject.admin || false,
    ];

    try {
      const { rows } = await db.query(text, values);
      // return res.status(201).send(rows[0]);
      // console.log(error);
      return rows[0];
    } catch (error) {
      // return res.status(400).send(error);
      // console.error(Object.keys(error));
      // console.error(error);
      // console.log(error.name);
      throw new Error(error.message);
    }
  }

  /**
 * Function to create a parcel in DB
 * @function
 * @param {object} parcelObject - Object containing parcel data
 * @return {object} created Parcel Object
 */
  static async createParcel(parcelObject) {
    const text = `INSERT INTO
          parcels(id, userId, destination, pickUpLocation, presentLocation, price, weight, status, created_date, modified_date)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8,  NOW(), NOW())
          returning *`;
    const values = [
      uuidv4(),
      parcelObject.userId,
      parcelObject.destination,
      parcelObject.pickUpLocation,
      parcelObject.presentLocation,
      parcelObject.price,
      parcelObject.weight,
      parcelObject.status,
    ];

    try {
      const { rows } = await db.query(text, values);
      // return res.status(201).send(rows[0]);
      return rows[0];
    } catch (error) {
      // return res.status(400).send(error);
      throw new Error(error);
    }
  }

  /**
 * Function to get all data in a table
 * @function
 * @param {string} tablename - Table in DB
 * @return {array} array of items in table
 */
  static async findAllInTable(tablename) {
    const findAllQuery = `SELECT * FROM ${tablename}`;
    try {
      // const { rows, rowCount } = await db.query(findAllQuery);
      const { rows } = await db.query(findAllQuery);
      // return res.status(200).send({ rows, rowCount });
      return rows;
    } catch (error) {
      // return res.status(400).send(error);
      throw new Error(error);
    }
  }

  /**
 * Function to find by id in DB
 * @function
 * @param {string} tablename - Table to look up
 * @param {string} id - Id
 * @return {object} item
 */
  static async findByIdFromTable(tablename, id) {
    const text = `SELECT * FROM ${tablename} WHERE id = $1`;
    try {
      const { rows } = await db.query(text, [id]);
      // console.log(rows);
      if (!rows[0]) {
        // return res.status(404).send({'message': 'reflection not found'});
        throw new Error(`${singularTableName(tablename)} not found`);
      }
      // return res.status(200).send(rows[0]);
      return rows[0];
    } catch (error) {
      // return res.status(400).send(error)
      throw new Error(error);
    }
  }

  /**
 * Function to find data in table by email
 * @function
 * @param {string} tablename - Object containing user data
 * @param {string} email - email address to look up
 * @return {object} User Object found
 * @throws {error} Error
 */
  static async findByEmailFromTable(tablename, email) {
    const text = `SELECT * FROM ${tablename} WHERE email = $1`;
    try {
      const { rows } = await db.query(text, [email]);
      // console.log(rows);
      if (!rows[0]) {
        // return res.status(404).send({'message': 'reflection not found'});
        throw new Error(`${singularTableName(tablename)} not found`);
      }
      // return res.status(200).send(rows[0]);
      return rows[0];
    } catch (error) {
      // return res.status(400).send(error)
      throw new Error(error);
    }
  }

  /**
 * Function to get parcels belonging to a user
 * @function
 * @param {string} userId - Id of user
 * @return {array} Parcels owned by User
 */
  static async getParcelsByUserId(userId) {
    try {
      const query = 'SELECT * from parcels WHERE userId=$1';
      const { rows } = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(error.message || 'An error occured');
    }
  }

  /**
 * Function to update a single field in row of DB table
 * @function
 * @param {string} tablename - table
 * @param {string} id - id
 * @param {object} fieldObject - Object containing field and data
 * @return {object} updated item
 */
  static async updateSingleFieldInTable(tablename, id, fieldObject) {
    const keys = Object.keys(fieldObject);
    if (!keys || keys.length !== 1) throw new Error('You supplied wrong field object');
    const field = keys[0];
    const findOneQuery = `SELECT * FROM ${tablename} WHERE id=$1`;
    const updateOneQuery = `UPDATE ${tablename}
      SET ${field}=$1, modified_date=NOW()
      WHERE id=$2 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [id]);
      if (!rows[0]) {
        // return res.status(404).send({'message': 'reflection not found'});
        throw new Error(`${singularTableName(tablename)} not found`);
      }
      const values = [
        fieldObject[field],
        id || rows[0].id,
      ];
      const response = await db.query(updateOneQuery, values);
      // return res.status(200).send(response.rows[0]);
      return (response.rows[0]);
    } catch (err) {
      // return res.status(400).send(err);
      throw new Error(err);
    }
  }

  /**
 * Function to delete from DB
 * @function
 * @param {string} tablename - Table to delete from
 * @param {object} id - id of item to delete
 * @return {object} object containing message acknowledging delete
 */
  static async deleteFromTableById(tablename, id) {
    const deleteQuery = 'DELETE FROM $1 WHERE id=$2 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [tablename, id]);
      if (!rows[0]) {
        // return res.status(404).send({'message': 'reflection not found'});
        throw new Error(`${singularTableName(tablename)} not found`);
      }
      // return res.status(204).send({ 'message': 'deleted' });
      return ({ message: 'Delete success' });
    } catch (error) {
      // return res.status(400).send(error);
      throw new Error(error);
    }
  }
}

// Users.create({
//   email: 'test@test.com',
//   firstname: 'Test',
//   lastname: 'Admin',
//   password: 'someHAsh',
// }).then(result => Users.delete(result.id));
// Users.findAll('users').then(result => console.log(result));
// Users.getOne('94a49a7b-705c-470d-9a1a-5312b79c0f74').then(result => console.log(result));
// Users.update('94a49a7b-705c-470d-9a1a-5312b79c074', { firstname: 'Ranny' })
// .then(result => console.log(result));
// console.log(singularTableName('parcels'));
