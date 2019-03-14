const jwt = require('jsonwebtoken');

module.exports = ({ req }) => {
  if (!req.headers.authorization) {
    req.isAuth = false;
    return req;
  }

  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    req.isAuth = false;
    return req;
  }

  try {
    const signedData = jwt.verify(token, process.env.TOKEN_KEY);
    req.isAuth = true;
    req.user = signedData;
  } catch (err) {
    console.error('Invalid signature');
    req.isAuth = false;
  }
  return req;
};
