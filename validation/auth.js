const { body } = require("express-validator");
exports.login = ()=>{
    return [
        body("email").notEmpty().withMessage("Please Provide an email").isEmail().withMessage('Please Provide a valid email'),
        body("password")
          .notEmpty()
          .withMessage("Please provide password")
          .isLength({ min: 4 })
          .withMessage("Password is 4 character minimum"),
      ]; 
}

exports.signup = ()=>{
    return [
        body("email").notEmpty().withMessage("Please Provide an email").isEmail().withMessage('Please Provide a valid email'),
        body("password")
          .notEmpty()
          .withMessage("Please provide password")
          .isLength({ min: 4 })
          .withMessage("Password is 4 character minimum"),
        body('password2')
        .notEmpty()
        .withMessage("Please provide password")
        .isLength({ min: 4 })
        .withMessage("Password is 4 character minimum")
        .custom((value, { req }) => {
            return value === req.body.password;
          })
          .withMessage('Password must match')
    ]
}


exports.forgetPassword = ()=>{
  return   body("email").notEmpty().withMessage("Please Provide an email").isEmail().withMessage('Please Provide a valid email')
}

exports.resetPassword = ()=>{
  return [
   
    body("password")
      .notEmpty()
      .withMessage("Please provide password")
      .isLength({ min: 4 })
      .withMessage("Password is 4 character minimum"),
    body('password2')
    .notEmpty()
    .withMessage("Please provide password")
    .isLength({ min: 4 })
    .withMessage("Password is 4 character minimum")
    .custom((value, { req }) => {
        return value === req.body.password;
      })
      .withMessage('Password must match')
]
}
