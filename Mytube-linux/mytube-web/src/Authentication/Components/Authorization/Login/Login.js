
import { LoginValidation } from "../../../InputValidation";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../../../App";

export default function Login({
  userslist,
  setuserslist,
  loggedUser,
  setLoggedUser,
}) {
  const { theme } = useContext(ThemeContext);
  const [logo, setLogo] = useState(
    "http://localhost:8000/icons/youtube-light.png"
  );
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  useEffect(() => {
    // Update logo path based on the theme
    setLogo(
      theme === "dark"
        ? "http://localhost:8000/icons/youtube-dark.png"
        : "http://localhost:8000/icons/youtube-light.png"
    );
  }, [theme]);

  function handleInputSave(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = LoginValidation(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/tokens/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      const data = await response.json();
  
      const { user } = data;

      if (!user || !user._id) {
        throw new Error("Invalid response format from server");
      }


      // Fetch token using user ID
      const jwtResponse = await fetch("http://localhost:8000/api/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user._id,
        }),
      });

      if (!jwtResponse.ok) {
        const jwtErrorData = await jwtResponse.json();
        throw new Error(jwtErrorData.message || "Failed to fetch token");
      }

      const tokenData = await jwtResponse.json();
      const { token } = tokenData;

      sessionStorage.setItem("token", token);
      setLoggedUser(user);

      setFormData({
        userName: "",
        password: "",
      });
      setErrors({});
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrors({
        userName: "Username or password is incorrect",
        password: "Username or password is incorrect",
      });
    }
  }
  async function handleLogout(event) {
    event.preventDefault(); // Prevent default behavior

    if (!loggedUser || !loggedUser._id) {
        console.error("User is not logged in");
        return;
    }

    try {
        // Make a request to the server to logout with user ID in params
        const response = await fetch(`http://localhost:8000/api/users/logout/${loggedUser._id}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const user = await response.json();

        // Check if the server response is OK
        if (response.ok) {
            // Clear local storage
            sessionStorage.removeItem("token"); // Remove token from sessionStorage

            // Reset logged user in state
            setLoggedUser(user);

            // Redirect to the login page
            navigate("/");
        } else {
            
          console.error("Error during logout:");
        }
    } catch (error) {
        console.error("Error during logout:", error);
    }
}

  return (
    <div className={`${theme === "dark" ? styles.darkMode : ""}`}>
      <div className={styles.headerLogin}>
        <Link to="/">
          <img className={styles.imgyt} src={logo} alt="YouTube" />
        </Link>
      </div>

      <div className={styles.loginWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainerLogin}>
          <h1>Login</h1>
          <div className={styles.inputWrapper}>
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              name="userName"
              onChange={handleInputSave}
              value={formData.userName}
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
              onChange={handleInputSave}
              value={formData.password}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}
          </div>

          <br />
          <button type="submit">SUBMIT</button>
          <button onClick={handleLogout}>Logout</button>
          <br />
          <br />
          <div className={styles.center}>
            <Link to="/register">Don’t have an account yet?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}