import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import parcelsController from './parcels';
import Validator from '../helpers/validator';

const users = [
  {
    id: 1,
    parcels: [1, 2, 3],
    fullName: 'User One',
  },
  {
    id: 2,
    parcels: [],
    fullName: 'User Two',
  },
];

const UsersController = {
  findAll() {
    return users || [];
  },

  getUser(userId) {
    return users.filter(items => items.id === userId)[0];
  },

  parcelsForUser(userId) {
    const user = UsersController.getUser(userId);
    if (user === undefined || user === null) {
      throw new Error('User not found');
    }
    return user.parcels;
  },

  index(req, res) {
    const allUsers = UsersController.findAll();
    return res.json(allUsers);
  },

  parcels(req, res) {
    try {
      const userParcels = UsersController.parcelsForUser(parseInt(req.params.id, 10));
      const populatedUserParcels = parcelsController.retrieveParcels(userParcels);
      return res.json(populatedUserParcels);
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  },

  create(req, res) {
    const { user } = req.body;
    // validate data
    Validator.check(user, ['email', 'password', 'firstname', 'lastname']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    user.id = UsersController.findAll().length + 1;
    user.email = user.email;
    return bcrypt.hash(user.password, null, null, (err, hash) => {
      if (err) return res.status(500).json({ error: 'An error occured while processing your request.' });
      user.password = hash;
      users.push(user);
      const uiUser = {};
      Object.assign(uiUser, user);
      delete uiUser.password;
      const token = jwt.sign(uiUser, process.env.secret);
      return res.json({ user: uiUser, token });
    });
  },
};

export default UsersController;
