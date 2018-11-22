import jwt from 'jsonwebtoken';
import Validator from '../helpers/validator';
// import { userHelpers } from '../helpers/mockdb';
import AuthHelpers from '../helpers/auth';
import DbHelpers from '../models/helpers';

/**
 * Auth controller - All functions for the handling authentication routes
 * @module controllers/users
 */
export default class AuthController {
  /**
 * signup - Sign up a user
 *
 * @function signup
 * @memberof  module:controllers/auth
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @returns {object} Returns an object containing user details or error
 */
  static signup(req, res) {
    // return res.json([]);
    let userObject = {};
    if (req.body.user) {
      userObject = req.body.user;
    } else {
      Object.assign(userObject, req.body);
    }
    Validator.check(userObject, ['email', 'password', 'firstname', 'lastname']);
    const errors = Validator.errors();
    const isEmail = /\S+@\S+\.\S+/.test(userObject.email);
    if (!isEmail) errors.push({ email: 'Email is Invalid' });
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    // if (user.email === 'test@test.com') user.parcels = [4];
    AuthHelpers.hash(userObject.password)
      .then((hash) => {
        DbHelpers.createUser({
          email: userObject.email,
          firstname: userObject.firstname,
          lastname: userObject.lastname,
          password: hash,
          admin: userObject.admin,
        }).then((newUser) => {
          const uiUser = {};
          Object.assign(uiUser, newUser);
          delete uiUser.password;
          const token = jwt.sign(uiUser, process.env.secret);
          return res.json({ user: uiUser, token });
        }).catch((error) => {
          if (error.message.indexOf('duplicate key value violates unique constraint') > -1) return res.status(422).json({ error: 'Email already in use, use another email' });
          return res.status(400).json({ error: error.message });
        });
      }).catch(() => res.status(500).json({ error: 'An error occured while processing your request.' }));
  }

  /**
 * login - User log in
 *
 * @function login
 * @memberof  module:controllers/auth
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @returns {object} Returns an object containing user details or error
 */
  static login(req, res) {
    Validator.check(req.body, ['email', 'password']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    DbHelpers.findByEmailFromTable('users', req.body.email)
      .then((foundUser) => {
        AuthHelpers.compare(req.body.password, foundUser.password)
          .then((result) => {
            const token = jwt.sign({
              id: foundUser.id,
              admin: foundUser.admin
            }, process.env.secret);
            return res.json({ auth: result, token });
          })
          .catch(() => res.status(500).json({ error: 'An error occured while processing your request' }));
      })
      .catch(() => res.status(401).send({ auth: false, message: 'Invalid credentials' }));
  }
}
