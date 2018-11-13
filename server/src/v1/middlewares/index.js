import jwt from 'express-jwt';

export default class Middleware {
  static isAuth(req, res, next) {
    return jwt({ secret: process.env.secret });
  }

  static isAdmin(req, res, next) {
    return next(req);
  }
}
