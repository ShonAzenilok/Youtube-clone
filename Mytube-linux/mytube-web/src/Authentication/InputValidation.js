export const InputValidation = (formData) => {
  const errors = {};

  !formData.userName && (errors.userName = "User Name is required");

  if (!formData.password) {
    errors.password = "Password is required";
  } else {
    formData.password.length < 8 &&
      (errors.password = "Password must be at least 8 characters long");
    !/[A-Z]/.test(formData.password) &&
      (errors.password = "Password must contain at least one uppercase letter");
    !/[a-z]/.test(formData.password) &&
      (errors.password = "Password must contain at least one lowercase letter");
    !/[0-9]/.test(formData.password) &&
      (errors.password = "Password must contain at least one number");
    !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) &&
      (errors.password =
        "Password must contain at least one special character");
  }

  formData.password !== formData.passwordValidation &&
    (errors.passwordValidation = "Passwords do not match");

  !formData.publicName && (errors.publicName = "Public Name is required");

  !formData.uploadImage && (errors.uploadImage = "Image upload is required");

  return errors;
};

export const LoginValidation = (formData) => {
  const errors = {};

  if (!formData.userName) {
    errors.userName = "User Name is required";
  }
  if (!formData.password) {
    errors.password = "Password is required";
  } else {
    formData.password.length < 8 &&
      (errors.password = "Password must be at least 8 characters long");
    !/[A-Z]/.test(formData.password) &&
      (errors.password = "Password must contain at least one uppercase letter");
    !/[a-z]/.test(formData.password) &&
      (errors.password = "Password must contain at least one lowercase letter");
    !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) &&
      (errors.password =
        "Password must contain at least one special character");
  }

  return errors;
};
