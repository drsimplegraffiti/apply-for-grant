const { jwtSign, jwtVerify } = require('../lib/jwt');
const { passwordHash, passwordCompare } = require('../lib/bcrypt');
const responseHandler = require('../utils/responseHandler');

const db = require('../database/db');
const sendEmail = require('../utils/mail');

// get all grants from the database by admin

exports.getAllGrants = async (req, res, next) => {
  try {
    const grants = await db.query('SELECT * FROM grants');
    return responseHandler(res, 200, 'All grants', grants[0]);
  } catch (error) {
    next(error);
  }
};

// Approve a grant

exports.approveGrant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [row] = await db.query('SELECT * FROM grants WHERE id = ?', [id]);
    if (row.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Grant not found',
      });
    }

    // get grant owner details
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [
      row[0].user_id,
    ]);

    //  change grant status to approved
    const grant = await db.query(
      'UPDATE grants SET grant_status = ? WHERE id = ?',
      ['Approved', id]
    );

    // extract the email of the grant owner
    const { email } = user[0];

    // send email
    const subject = 'Grant Approved';
    const text = `Hi ${user[0].username}, your grant application has been approved.`;
    await sendEmail({ email, subject, text });

    return responseHandler(res, 200, 'Grant approved', grant[0]);
  } catch (error) {
    next(error);
  }
};

// Reject a grant

exports.rejectGrant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [row] = await db.query('SELECT * FROM grants WHERE id = ?', [id]);
    if (row.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Grant not found',
      });
    }

    // get grant owner details
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [
      row[0].user_id,
    ]);

    //  change grant status to rejected
    const grant = await db.query(
      'UPDATE grants SET grant_status = ? WHERE id = ?',
      ['Rejected', id]
    );

    // extract the email of the grant owner
    const { email } = user[0];

    // send email
    const subject = 'Grant Rejected';
    const text = `Hi ${user[0].username}, your grant application has been rejected.`;
    await sendEmail({ email, subject, text });

    return responseHandler(res, 200, 'Grant rejected', grant[0]);
  } catch (error) {
    next(error);
  }
};

// get all users from the database by admin

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.query('SELECT * FROM users');
    return responseHandler(res, 200, 'All users', users[0]);
  } catch (error) {
    next(error);
  }
};

// Get stats of grants by admin

exports.getGrantStats = async (req, res, next) => {
  try {
    const [row] = await db.query('SELECT * FROM grants');
    if (row.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No grant found',
      });
    }

    const stats = {
      total: row.length,
      approved: row.filter((grant) => grant.grant_status === 'Approved').length,
      rejected: row.filter((grant) => grant.grant_status === 'Rejected').length,
      pending: row.filter((grant) => grant.grant_status === 'Pending').length,
    };

    return responseHandler(res, 200, 'Grant stats', stats);
  } catch (error) {
    next(error);
  }
};

// Get stats of users by admin

exports.getUserStats = async (req, res, next) => {
  try {
    const [row] = await db.query('SELECT * FROM users');
    if (row.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No user found',
      });
    }

    const stats = {
      total: row.length,
    };

    return responseHandler(res, 200, 'User stats', stats);
  } catch (error) {
    next(error);
  }
};

// search users by admin using advanced search using regex

exports.searchUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const [row] = await db.query(
      'SELECT * FROM users WHERE username REGEXP ?',
      [search]
    );
    if (row.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No user found',
      });
    }

    return responseHandler(res, 200, 'Users found', row);
  } catch (error) {
    next(error);
  }
};

// search grants by admin using advanced search using regex

exports.searchGrants = async (req, res, next) => {
  try {
    const { search } = req.query;
    const [row] = await db.query(
      'SELECT * FROM grants WHERE grant_title REGEXP ?',
      [search]
    );
    if (row.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No grant found',
      });
    }

    return responseHandler(res, 200, 'Grants found', row);
  } catch (error) {
    next(error);
  }
};


// calculate the total amount of grants disbursed by admin

exports.getTotalAmountDisbursed = async (req, res, next) => {
    try {
        const [row] = await db.query('SELECT * FROM grants');
        if (row.length === 0) {
        return res.status(404).json({
            status: 404,
            message: 'No grant found',
        });
        }
    
        const total = row.reduce(
        (acc, grant) => acc + Number(grant.grant_amount),
        0
        );
    
        return responseHandler(res, 200, 'Total amount disbursed', total);
    } catch (error) {
        next(error);
    }
}

