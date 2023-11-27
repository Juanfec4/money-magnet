import { Request, Response } from "express";
import knexConfig from "../../knexfile";
import knexLibrary from "knex";
import jwt from "jsonwebtoken";
import passport from "passport";
import { User } from "../models/user.model";
import {
  isValidEmail,
  isValidPassword,
  isValidRequestBody,
  isValidUsername,
} from "../services/validators";
import { hashPassword } from "../services/authService";

const knex = knexLibrary(knexConfig);

const JWT_EXPIRY = "7d";

//Login
const loginUser = async (req: Request, res: Response) => {
  passport.authenticate(
    "local",
    { session: false },
    (error: any, user: User, info: any) => {
      //Error handling
      if (error || !user) {
        return res.status(400).json(info.message);
      }
      req.logIn(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }

        //Construct user payload
        const payload = { user_id: user.id, username: user.username };

        //Send auth token to client
        const token = jwt.sign(payload, process.env.JWT_SECRET || "", {
          expiresIn: JWT_EXPIRY,
        });
        return res.status(200).json({ Authorization: token });
      });
    }
  )(req, res);
};

//Register
const registerUser = async (req: Request, res: Response) => {
  //Validate request body
  if (!isValidRequestBody(req, ["username", "password", "email"])) {
    return res.status(400).json("Missing request body params.");
  }

  //Validate parameters
  if (!isValidEmail(req.body.email)) {
    return res.status(400).json("Invalid email.");
  }

  if (!isValidPassword(req.body.password)) {
    return res
      .status(400)
      .json(
        "Invalid password, password must contain at least 1 capital letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long."
      );
  }

  if (!isValidUsername(req.body.username)) {
    return res
      .status(400)
      .json(
        "Invalid username, username must contain only letters, numbers, underscores, or hyphens (no spaces allowed)."
      );
  }

  //Create user object
  const newUser: User = {
    email: req.body.email,
    username: req.body.username,
    password: hashPassword(req.body.password),
  };

  try {
    //Check if user already exists
    const existingUser = await knex("users")
      .where({ email: newUser.email })
      .orWhere({ username: newUser.username })
      .first();

    if (existingUser) {
      return res.status(400).json("User already exists.");
    }
    //Create user on DB
    await knex("users").insert(newUser);

    return res.status(201).json();
  } catch (e) {
    return res.status(500).json(e);
  }
};

export default {
  loginUser,
  registerUser,
};
