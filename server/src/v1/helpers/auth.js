import bcrypt from 'bcrypt-nodejs';

export default class AuthHelper {
  static hash(plain) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(plain, null, null, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  }

  static compare(plain, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plain, hash, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}
