const express = require('express')
const mongoose = require("mongoose");
const passport = require('passport');
const User = require('./models/User')
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt')
require('dotenv').config();

const app = express();


const adjustExpressMiddleware = () => {
    const opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.TOKEN_KEY;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({_id: jwt_payload.user_id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
    app.use(express.urlencoded({extended: true}))
    app.use('/auth', require('./routes/auth.routes'))
    app.use('/protected', passport.authenticate('jwt', { session: false }), require('./routes/protected.router'))
}

const start = async () => {
    try {
        mongoose.set("strictQuery", false);

        await mongoose.connect(process.env.MONGO_CONNECTION_STRING)
        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log('server has been started')
        })
    } catch (e) {
        console.log(e)
    }
}

adjustExpressMiddleware()
start()

