import jwt from 'jsonwebtoken';
import Validator from '../helpers/validator';
import AuthHelpers from '../helpers/auth';
import DbHelpers from '../models/helpers';

const {
  createUser, findByEmailFromTable
} = DbHelpers;

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
    Validator.check(req.body, ['email', 'password', 'firstname', 'lastname']);
    const errors = Validator.errors();
    const isEmail = /\S+@\S+\.\S+/.test(req.body.email);
    if (!isEmail) errors.push({ email: 'Email is Invalid' });
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }

    const userObject = {
      email: req.body.email.trim(),
      password: req.body.password.trim(),
      firstname: req.body.firstname.trim(),
      lastname: req.body.lastname.trim(),
      admin: req.body.admin
    };

    AuthHelpers.hash(userObject.password)
      .then((hash) => {
        createUser({
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

    const userObject = {
      email: req.body.email.trim(),
      password: req.body.password.trim(),
    };

    findByEmailFromTable('users', userObject.email)
      .then((foundUser) => {
        AuthHelpers.compare(userObject.password, foundUser.password)
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
