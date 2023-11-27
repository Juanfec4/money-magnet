import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { isMatchingHash } from "../services/authService";
import knexConfig from "../../knexfile";
import knexLibrary from "knex";

const knex = knexLibrary(knexConfig);

//Passport login config
passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      try {
        //Get user
        const user = await knex("users").where({ username }).first();
        //Check if user exists
        if (!user) {
          return done(null, false, { message: "Invalid username." });
        }

        //Check if passwords match
        if (!isMatchingHash(password, user.password)) {
          return done(null, false, { message: "Invalid password." });
        }
        //Return user
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  )
);
