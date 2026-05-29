import { body, validationResult } from "express-validator";

function validationRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: errors.array()[0].msg 
    });
  }
  next();
}

export const validationRegisterUser = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("contact")
    .notEmpty()
    .withMessage("contact is required")
    .matches(/^\d{10}$/)
    .withMessage("contact must be a 10-digit number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullname")
    .notEmpty()
    .withMessage("full name is required")
    .isLength({ min: 3 })
    .withMessage("full name must be at least 3 character long"),

  validationRequest,
];

export const validationLoginUser = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.username) {
      throw new Error("Email or username is required");
    }
    return true;
  }),

  validationRequest,
];
