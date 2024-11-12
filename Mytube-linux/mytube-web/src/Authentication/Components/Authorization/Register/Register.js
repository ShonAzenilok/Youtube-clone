import { useEffect, useState, useContext } from "react";
import { InputValidation } from "../../../InputValidation";
import styles from "./Register.module.css";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../../../../App";

export default function Register() {
  const { theme } = useContext(ThemeContext);
  const [logo, setLogo] = useState(
    "http://localhost:8000/icons/youtube-light.png"
  );

  useEffect(() => {
    setLogo(
      theme === "dark"
        ? "http://localhost:8000/icons/youtube-dark.png"
        : "http://localhost:8000/icons/youtube-light.png"
    );
  }, [theme]);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    passwordValidation: "",
    publicName: "",
    profilePic: null,
  });

  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  function handleInputSave(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleImage(event) {
    const file = event.target.files[0];
    setFormData({
      ...formData,
      profilePic: file,
    });

    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageUrl(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Test if FormData is correctly created
    const formDataToSend = new FormData();
    formDataToSend.append("userName", formData.userName);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("passwordValidation", formData.passwordValidation);
    formDataToSend.append("publicName", formData.publicName);
    if (formData.profilePic) {
      formDataToSend.append("profilePic", formData.profilePic);
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/tokens/register",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErrors({
          server: data.message,
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors({ server: "An error occurred while registering the user." });
    }
  }

  return (
    <div className={`parent ${theme === "dark" ? styles.darkMode : ""}`}>
      <div className={styles.headerLogin}>
        <Link to="/">
          <img className={styles.imgyt} src={logo} alt="YouTube" />
        </Link>
      </div>

      <div className={styles.formContainer}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              placeholder="User Name"
              onChange={handleInputSave}
            />
            {errors.userName && (
              <p className={styles.error}>{errors.userName}</p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleInputSave}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="passwordValidation">Password Validation</label>
            <input
              type="password"
              name="passwordValidation"
              value={formData.passwordValidation}
              placeholder="Password Validation"
              onChange={handleInputSave}
            />
            {errors.passwordValidation && (
              <p className={styles.error}>{errors.passwordValidation}</p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="publicName">Public Name</label>
            <input
              type="text"
              name="publicName"
              value={formData.publicName}
              placeholder="Public Name"
              onChange={handleInputSave}
            />
            {errors.publicName && (
              <p className={styles.error}>{errors.publicName}</p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="profilePic">Upload Image</label>
            <input type="file" name="profilePic" onChange={handleImage} />
            {errors.profilePic && (
              <p className={styles.error}>{errors.profilePic}</p>
            )}
            {imageUrl && (
              <img
                className={styles.uploadedImg}
                src={imageUrl}
                alt="selected-image"
              />
            )}
          </div>

          <button type="submit">Register</button>
        </form>
        {errors.server && <p className={styles.error}>{errors.server}</p>}
        <Link to="/login">
          <button className={styles.loginbtn}>Log In</button>
        </Link>
      </div>
    </div>
  );
}