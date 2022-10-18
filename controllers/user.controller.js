const { jwtSign, jwtVerify } = require('../lib/jwt');
const { passwordHash, passwordCompare } = require('../lib/bcrypt');
const responseHandler = require('../utils/responseHandler');

const db = require('../database/db');
const sendEmail = require('../utils/mail');

// create a new user

exports.createNewUser = async (req, res, next) => {
  try {
    const { email, username, phone, gender, password, dob } = req.body;

    //  check if email already exists
    const [row] = await db.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);

    if (row.length > 0) {
      return res.status(409).json({
        status: 400,
        message: 'Email already exists',
      });
    }

    // hash password
    const hashedPassword = await passwordHash(password);

    const user = await db.query(
      'INSERT INTO users (email, username, phone,password, gender, dob) VALUES (?,?,?,?,?,?)',
      [email, username, phone, hashedPassword, gender, dob]
    );

    let data = {
      id: user[0].insertId,
      email,
      username,
      phone,
    };

    const token = await jwtSign(data);

    // send email
    const subject = 'Welcome to AB Code';
    const text = `Hi ${username}, welcome to AB Code. We are glad to have you on board.`;
    await sendEmail({ email, subject, text });
    return responseHandler(res, 200, 'User created successfully', {
      token,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// login user
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);

    if (user.length === 0) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await passwordCompare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid email or password',
      });
    }

    let data = {
      id: user[0].id,
      email: user[0].email,
      username: user[0].username,
      phone: user[0].phone,
      role: user[0].role,
    };

    const token = await jwtSign(data);
    return responseHandler(res, 200, 'Login successful', {
      token,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Apply for grant
exports.applyForGrant = async (req, res, next) => {
  try {
    const {
      grant_name,
      grant_type,
      grant_amount,
      grant_description,
      grant_status,
    } = req.body;
    const { id } = req.user;

    // check if grant already exists
    const [row] = await db.query(
      'SELECT * FROM grants WHERE grant_name = ? AND user_id = ?',
      [grant_name, id]
    );

    if (row.length > 0) {
      return res.status(409).json({
        status: 400,
        message: 'Grant already exists',
      });
    }

    const grant = await db.query(
      'INSERT INTO grants (grant_name, grant_type, grant_amount, grant_description, grant_status, user_id) VALUES (?,?,?,?,?,?)',
      [
        grant_name,
        grant_type,
        grant_amount,
        grant_description,
        grant_status,
        id,
      ]
    );

    let data = {
      id: grant[0].insertId,
      grant_name,
      grant_type,
      grant_amount,
      grant_description,
      grant_status: 'Pending',
    };

    // send email
    const subject = 'Grant Application';
    const text = `Hi ${req.user.username}, your grant application has been received. We will get back to you shortly.`;
    await sendEmail({ email: req.user.email, subject, text });

    return responseHandler(res, 200, 'Grant created successfully', {
      data,
    });


  } catch (error) {
    next(error);
  }
};

