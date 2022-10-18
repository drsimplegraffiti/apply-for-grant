const { jwtVerify } = require('../lib/jwt');
const customError = require('../utils/customError');

const validateUserToken = async (req, res, next) => {
  try {
    // console.log(req.headers.authorization);
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = await jwtVerify(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }
    req.user = decoded;
    console.log('===req.user');
    console.log(req.user);
    console.log('===req.user');

    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized...' });
  }
};

const validateAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      // use custom error statusCode, message, data
      throw new customError(
        401,
        'You are not authorized to perform this action',
        []
      );
    }
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { validateUserToken, validateAdmin };
