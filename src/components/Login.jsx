import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { fetchUserIdByUsername } from "../api/user"; // Importe a função para obter o userId
import styles from "../styles/pages/LoginPage.module.css";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/login", {
        username,
        password
      });


      console.log(response);
      const token = response.headers['authorization'].replace('Bearer ', '');
      if (token) {
        localStorage.setItem("authToken", token);
        const userId = await fetchUserIdByUsername(username);
        localStorage.setItem("userId", userId);
        navigate("/caixa");
      } else {
        setError("Token não encontrado na resposta");
      }

    } catch (err) {
      setError("Usuário ou senha incorretos");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
      <main className={styles.loginPage}>
        <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/142feee10be7498b5165fd5c0e31375b22670bc2d5534f37af24343589be3b57?placeholderIfAbsent=true&apiKey=3a7bf244ea284dc69a7afb3b5c0a50d1"
            className={styles.backgroundImage}
            alt="Background"
        />
        <div className={styles.container}>
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <div className={styles.logoContainer}>
              <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/fa365b653601f7eccc3519ad6ba0157f5f31550c4e9fe489acbac53ad6f3f8df?placeholderIfAbsent=true&apiKey=3a7bf244ea284dc69a7afb3b5c0a50d1"
                  className={styles.logoImage}
                  alt="SISO Logo"
              />
              <div className={styles.logoText}>SISO</div>
            </div>
            <label htmlFor="loginInput" className={styles.inputLabel}>
              LOGIN
            </label>
            <input
                type="text"
                id="loginInput"
                className={styles.inputField}
                aria-label="Login input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <label htmlFor="passwordInput" className={styles.inputLabel}>
              SENHA
            </label>
            <div className={styles.passwordContainer}>
              <input
                  type={showPassword ? "text" : "password"}
                  id="passwordInput"
                  className={styles.inputField}
                  aria-label="Password input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
              <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/18d16c2035263816b89ea999aabc5578b7454f277bd55f64e03ac70c22602948?placeholderIfAbsent=true&apiKey=3a7bf244ea284dc69a7afb3b5c0a50d1"
                  className={styles.visibilityIcon}
                  alt={showPassword ? "Hide password" : "Show password"}
                  role="button"
                  tabIndex="0"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
              />
            </div>
            {error && <p className={styles.error} aria-live="assertive">{error}</p>}
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
        </div>
      </main>
  );
}

export default Login;
