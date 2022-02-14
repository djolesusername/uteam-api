import User from "../models/User";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import passportLocal from "passport-local";
//import passport from "passport";
dotenv.config();
//import Company from "../models/companies";
import bcrypt from "bcryptjs";
import { UserRole, SignInOptions } from "../types/types";
import { JwtPayload } from "jsonwebtoken";

const LocalStrategy = passportLocal.Strategy;

const localLogin = new LocalStrategy(
    {
        //  usernameField: "email",
        //  passwordField: "password",
        passReqToCallback: true,
    },
    async function (req, username, password, done) {
        const providedCredential =
            username.indexOf("@") > -1
                ? SignInOptions.EMAIL
                : SignInOptions.USERNAME;

        //Passport doesn't accept username or email so we have to figure out what was sent
        //Username doesn't have special characters allowed which means we can use this check to distinguish between email and username
        let user: User | null;
        if (providedCredential === "username") {
            user = await User.findOne({
                where: {
                    username,
                },
            });
            if (user) {
                const result = await bcrypt.compare(password, user.password);
                if (!result) {
                    console.log("password mismatch");
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            } else {
                console.log("user not found");
                return done(null, false);
            }
        } else if (providedCredential === "email") {
            user = await User.findOne({
                where: {
                    email: username,
                },
            });
            if (user) {
                const result = await bcrypt.compare(password, user.password);
                if (!result) {
                    console.log("password mismatch");
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            } else {
                console.log("user not found");
                return done(null, false);
            }
        }

        // check if password matches
    }
);

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    // passReqToCallback: true,
};

// Create JWT strategy
const jwtStrat = new JwtStrategy(jwtOptions, async function (
    payload: JwtPayload,
    done
) {
    // See if the user ID in the payload exists in our database
    // If it does, call 'done' with that other
    // otherwise, call done without a user object
    //const { username, password, email } = payload.body;
    const { username, exp } = payload;
    //checking if token already expired and if we have a valid username
    try {
        let user;

        if (exp && exp - Date.now() / 1000 > 0 && username) {
            user = await User.findOne({
                where: { username: username },
            });
            //Not checking if he is THE company admin of the COMPANY in question
            if (user && user.role === UserRole.COMPANYADMIN) {
                return done(null, user);
            } else {
                console.log(user);
                return done(null, false);
            }
        }
    } catch (err) {
        return done(null, false);
        console.log("line96");
    }
    return done(null, false);
});

// Tell passport to use this strategy

const passportConfig = (passport: {
    use: (arg0: JwtStrategy | passportLocal.Strategy) => void;
}) => {
    passport.use(jwtStrat);
    passport.use(localLogin);
};
export default passportConfig;
