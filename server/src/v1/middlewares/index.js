import jwt from 'jsonwebtoken';

export default class Middleware {
  static isAuth(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, process.env.secret, (err, payload) => {
        if (err) return res.json({ auth: false, message: 'Invalid token' });
        req.user = payload;
        return next();
      });
    } else {
      return res.status(401).json({
        auth: false,
        message: 'Authorization token is not provided.',
      });
    }
    return next(req);
  }

  static isAdmin(req, res, next) {
    return next(req);
  }
}
