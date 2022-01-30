import User from "../models/User";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import passportLocal from "passport-local";
import passport from "passport";
dotenv.config();
//import Company from "../models/companies";
import bcrypt from "bcryptjs";
import { UserRole } from "../types/types";

const LocalStrategy = passportLocal.Strategy;

const localLogin = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
    },
    function (req, email, password, done) {
        const generateHash = function (password: string) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
        };

        User.findOne({
            where: {
                email: email,
            },
        })
            .then(function (user) {
                if (user) {
                    return done(null, false, {
                        message: "email already taken",
                    });
                    console.log("mail already taken");
                } else {
                    const pass = generateHash(password);

                    const data = {
                        email: email,
                        password: pass,
                        username: req.body.username,
                        public_key: "0",
                        last_login: null,
                        role: UserRole.COMPANYADMIN,
                    };

                    User.create(data).then(function (newUser: User) {
                        if (!newUser) {
                            return done(null, false);
                        }

                        if (newUser) {
                            return done(null, newUser, { message: "tappost" });
                        }
                    });
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }
);

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: process.env.JWT_SECRET,
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    // See if the user ID in the payload exists in our database
    // If it does, call 'done' with that other
    // otherwise, call done without a user object
    const user = User.findOne({
        where: {
            email: payload.email,
        },
    });

    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
});

// Tell passport to use this strategy

const passportConfig = (passport: {
    use: (arg0: JwtStrategy | passportLocal.Strategy) => void;
}) => {
    passport.use(jwtLogin);
    passport.use(localLogin);
};
export default passportConfig;
