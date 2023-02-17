import { Router } from "express";
import {body, validationResult} from 'express-validator';
import { checkErrors } from "../utils/validationMiddleware";

const router = Router();

// {  email:"teddyputus1@gmail.com", password:"thisisapassword", username:"Tedernator", firstName:"Teddy", lastName:"Putus", dob: "21/12/1992"}
// Routes for /register

router.post("/", 
body('email').notEmpty(),
body('password').notEmpty(),
body('username').notEmpty(),
body('firstName').notEmpty(),
body('lastName').notEmpty(),
body('dob').notEmpty(),
checkErrors,
(req, res) => {
  res.status(200).send("/register POST route");
});

export { router };
