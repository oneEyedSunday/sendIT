import jwt from 'jsonwebtoken';
import Validator from '../helpers/validator';
import { userHelpers } from '../helpers/mockdb';
import AuthHelpers from '../helpers/auth';
import dbHelpers from '../helpers/db/helpers';


const authController = {
  signup(req, res) {
    const { user } = req.body;
    Validator.check(user, ['email', 'password', 'firstname', 'lastname']);
    const errors = Validator.errors();
    const isEmail = /\S+@\S+\.\S+/.test(user.email);
    if (!isEmail) errors.push({ email: 'Email is Invalid' });
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    // if (user.email === 'test@test.com') user.parcels = [4];
    AuthHelpers.hash(user.password)
      .then((hash) => {
        dbHelpers.createUser({
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          password: hash,
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
  },

  login(req, res) {
    Validator.check(req.body, ['email', 'password']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    dbHelpers.findByEmail('users', req.body.email)
      .then((foundUser) => {
        AuthHelpers.compare(req.body.password, foundUser.password)
          .then((result) => {
            const token = jwt.sign({ id: foundUser.id, admin: foundUser.admin }, process.env.secret);
            return res.json({ auth: result, token });
          })
          .catch(() => res.status(500).json({ error: 'An error occured while processing your request' }));
      })
      .catch(() => res.status(401).send({ auth: false, message: 'Invalid credentials' }));
  },
};

export default authController;
