const services = require("../utils/services.js"),
    config = services.config,
    mongoose = require('mongoose'),
    User = mongoose.model('UserModel'),
    CodedError = require('../utils/CodedError.js'),
    mapBasicUser = require('./userAccountController.js').mapBasicUser,
    winston = require('winston');

const systemLogger = winston.loggers.get('system');


exports.getUser = function (req, res, next) {
    User.findById(req.params.user).select('-pwd').exec().then((user) => {
        if (req.session.user._id == user._id) {
            req.session._garbage = new Date();
            req.session.touch();
        }
        return res.status(200).jsonp(mapBasicUser(user));
    }).catch((err) => {
        return next(err);
    });
}

exports.getUsers = function (req, res, next) {
    User.find({}).select('-pwd').exec().then((users) => {
        users = users.map(mapBasicUser);
        return res.status(200).jsonp(users);
    }).catch((err) => {
        return next(err);
    });
}