/**
 * Created by Kronenberg on 05.07.2017.
 */

'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../../config/config');

function createToken(user) {
    let scopes;
    // Check if the user object passed in
    // has admin set to true, and if so, set
    // scopes to admin
    if (user.admin) {
        scopes = 'admin';
    }
    // Sign the JWT
    return jwt.sign({
        id: user._id, username: user.username, scope: scopes },
        config.SECRET_WEB_TOKEN,
        { algorithm: 'HS256', expiresIn: "1h" } );
}

module.exports = createToken;