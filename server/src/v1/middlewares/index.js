export default class Middleware {
  static isAuth(req, res, next) {
    return next(req);
  }

  static isAdmin(req, res, next) {
    return next(req);
  }
}
