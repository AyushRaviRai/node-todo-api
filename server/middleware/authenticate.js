const {User} = require('./../models/user.js');

var authenticate = (request, response, next) => {
    token = request.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        request.token = token;
        request.user = user;
        next();
    }).catch((error) => {
        response.status(401).send();
    });
};

module.exports = {authenticate};