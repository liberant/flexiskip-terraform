// const middlewares = require('../account/handlers');
const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

// get list of user
router.get('/admin/users', [checkUserAuthenticated, handlers.getUserList]);

// get detail of user
router.get('/admin/users/:id', [checkUserAuthenticated, handlers.getUserDetail]);

// update status of multiple users
router.put('/admin/users/status', [checkUserAuthenticated, handlers.massUpdateUserStatus]);

// send password reset instruction email to user
router.post('/admin/users/:id/reset-pwd-request', [checkUserAuthenticated, handlers.requestResetPassword]);

// soft delete user
router.delete('/admin/users/:id', [checkUserAuthenticated, handlers.deleteUser]);

// update detail of user
router.put('/admin/users/:id', [checkUserAuthenticated, handlers.updateUserDetail]);

// get user list by organisation
router.get('/admin/users/contractor/:id', [checkUserAuthenticated, handlers.getContractorsByOrganisation]);

// get transction by user
router.get('/admin/users/:id/transactions', [checkUserAuthenticated, handlers.getTransactionsByUser]);

module.exports = router;
