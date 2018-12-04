import jwt from 'jsonwebtoken';
import AuthHelpers from '../helpers/auth';
import DbHelpers from '../models/helpers';
import errors from '../helpers/errors';

const {
  createUser, findByEmailFromTable
} = DbHelpers;

const { serverError, authFailed, duplicateEmail } = errors;

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
          if (error.message.indexOf('duplicate key value violates unique constraint') > -1) return res.status(duplicateEmail.status).json({ error: duplicateEmail.message });
          return res.status(serverError.status).json({ error: serverError.message });
        });
      }).catch(() => res.status(serverError.status).json({ error: serverError.message }));
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
            if (result === false) return res.status(authFailed.status).json({ auth: false, message: authFailed.message });
            jwt.sign({
              id: foundUser.id,
              admin: foundUser.admin
            }, process.env.secret, (err, token) => {
              if (err) return res.status(serverError.status).json({ error: serverError.message });
              return res.json({ auth: true, token });
            });
          })
          .catch(() => res.status(serverError.status).json({ error: serverError.message }));
      })
      .catch(() => res.status(authFailed.status).send({ auth: false, message: authFailed.message }));
  }
}
