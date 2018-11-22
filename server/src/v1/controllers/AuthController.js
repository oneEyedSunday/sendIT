import jwt from 'jsonwebtoken';
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
    const userObject = {
      email: req.body.email.trim(),
      password: req.body.password.trim(),
    };

    findByEmailFromTable('users', userObject.email)
      .then((foundUser) => {
        AuthHelpers.compare(userObject.password, foundUser.password)
          .then((result) => {
            if (result === false) return res.status(401).json({ auth: false, message: 'Invalid Credentials' });
            jwt.sign({
              id: foundUser.id,
              admin: foundUser.admin
            }, process.env.secret, (err, token) => {
              if (err) return res.status(500).json({ error: 'An error occured while processing your request' });
              return res.json({ auth: true, token });
            });
          })
          .catch(() => res.status(500).json({ error: 'An error occured while processing your request' }));
      })
      .catch(() => res.status(401).send({ auth: false, message: 'Invalid credentials' }));
  }
}
