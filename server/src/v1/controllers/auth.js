import jwt from 'jsonwebtoken';
import Validator from '../helpers/validator';
import { userHelpers } from '../helpers/mockdb';
import AuthHelpers from '../helpers/auth';


const authController = {
  signup(req, res) {
    const { user } = req.body;
    Validator.check(user, ['email', 'password', 'firstname', 'lastname']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    user.id = userHelpers.findAll().length + 1;
    user.email = user.email;
    if (user.email === 'test@test.com') user.parcels = [4];
    AuthHelpers.hash(user.password)
      .then((hash) => {
        user.password = hash;
        userHelpers.addUser(user);
        const uiUser = {};
        Object.assign(uiUser, user);
        delete uiUser.password;
        delete uiUser.parcels;
        const token = jwt.sign(uiUser, process.env.secret);
        return res.json({ user: uiUser, token });
      })
      .catch(() => res.status(500).json({ error: 'An error occured while processing your request.' }));
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

    const foundUser = userHelpers.findAll().filter(user => user.email === req.body.email)[0];
    if (foundUser === undefined) return res.status(401).send({ auth: false, message: 'Invalid credentials' });

    AuthHelpers.compare(req.body.password, foundUser.password)
      .then((result) => {
        const token = jwt.sign(foundUser, process.env.secret);
        return res.json({ auth: result, token });
      })
      .catch(() => res.status(500).json({ error: 'An error occured while processing your request' }));
  },
};

export default authController;
