import uuidv4 from 'uuid/v4';
import db from '.';

const singularTableName = (tablename) => {
  const firstLetter = tablename.charAt(0).toUpperCase();
  const singular = tablename.substr(0, tablename.length - 1);
  return firstLetter.concat(singular.slice(1));
};

const DBHelpers = {
  async createUser(userObject) {
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
  },

  async createParcel(parcelObject) {
    const text = `INSERT INTO
          parcels(id, userId, destination, parcelLocation, presentLocation, status, created_date, modified_date)
          VALUES($1, $2, $3, $4, $5, $6, NOW(), NOW())
          returning *`;
    const values = [
      uuidv4(),
      parcelObject.userId,
      parcelObject.destination,
      parcelObject.parcelLocation,
      parcelObject.presentLocation,
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
  },

  async findAll(tablename) {
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
  },
  async find(tablename, id) {
    const text = 'SELECT * FROM $1 WHERE id = $2';
    try {
      const { rows } = await db.query(text, [tablename, id]);
      if (!rows[0]) {
        // return res.status(404).send({'message': 'reflection not found'});
        throw new Error(`${singularTableName(tablename)} not found`);
      }
      // return res.status(200).send(rows[0]);
      return (rows[0]);
    } catch (error) {
      // return res.status(400).send(error)
      throw new Error(error);
    }
  },
  async updateSingleField(tablename, id, fieldObject) {
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
        fieldObject.firstname || rows[0].firstname,
        id,
      ];
      const response = await db.query(updateOneQuery, values);
      // return res.status(200).send(response.rows[0]);
      return (response.rows[0]);
    } catch (err) {
      // return res.status(400).send(err);
      throw new Error(err);
    }
  },

  async delete(tablename, id) {
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
  },
};

export default DBHelpers;
// Users.create({
//   email: 'test@test.com',
//   firstname: 'Test',
//   lastname: 'Admin',
//   password: 'someHAsh',
// }).then(result => Users.delete(result.id));
// Users.findAll('users').then(result => console.log(result));
// Users.getOne('94a49a7b-705c-470d-9a1a-5312b79c0f74').then(result => console.log(result));
// Users.update('94a49a7b-705c-470d-9a1a-5312b79c0f74', { firstname: 'Ranny' }).then(result => console.log(result));
// console.log(singularTableName('parcels'));
