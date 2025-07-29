import * as yup from "yup";

export const validateRegister = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|co\.uk|ac\.th)$/,
      "Email must be from a valid domain (.com, .net, etc.)"
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#_]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password not match"),
});

export const validateLogin = yup.object({
  email: yup
    .string()
    .required("Please enter your email")
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|co\.uk|ac\.th)$/,
      "Email must be from a valid domain (.com, .net, etc.)"
    ),
  password: yup
    .string()
    .required("Please enter your password")
    .min(6, "Password must be at least 6 characters"),
});

export const validateEmail = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|co\.uk|ac\.th)$/,
      "Email must be from a valid domain (.com, .net, etc.)"
    ),
});

export const validateResetToken = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#_]/,
      "Password must contain at least one special character"
    ),
});

export const validate = (schema) => async (req, res, next) => {
  console.log(req.body);
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errMsg = error.errors.map((item) => item);
    const errTxt = errMsg.join(" , ");
    console.log(errTxt);
    const mergeErr = new Error(errTxt);
    next(mergeErr);
  }
};
