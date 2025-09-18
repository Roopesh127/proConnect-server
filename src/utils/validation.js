const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("firstName and LastName is mandatory");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email id is mandatory");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "about",
    "photoUrl",
    "gender",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};
module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
