import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { useFormInput } from "../hooks/useFormInput";
import { useTogglePassword } from "../hooks/useTogglePassword";

import eyeOnBlack from "../assets/eye-fill-black.svg";
import eyeOffBlack from "../assets/eye-slash-fill-black.svg";
import eyeOnCrimson from "../assets/eye-fill-crimson.svg";
import eyeOffCrimson from "../assets/eye-slash-fill-crimson.svg";

export function Login() {
  const navigate = useNavigate();

  const email = useFormInput(
    "",
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    "Enter a valid email"
  );
  const password = useFormInput(
    "",
    (val) => val.length >= 6,
    "Password must be at least 6 characters"
  );
  const [showPassword, togglePassword] = useTogglePassword();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Optional loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate fields
    if (!email.value) {
      email.setError("Email is required");
      return;
    }
    if (!password.value) {
      password.setError("Password is required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("https://686faa6c91e85fac42a203ee.mockapi.io/users");

      const matchedUser = res.data.find(
        (user) =>
          user.email.toLowerCase() === email.value.toLowerCase() &&
          user.password === password.value
      );

      if (matchedUser) {
        localStorage.setItem("loginData", JSON.stringify(matchedUser));
        toast.success("Loged In Successfully!");
        navigate("/");
      } else {
        setError("Invalid email or password");
        toast.error("Failed to Login. Try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Failed to Login. Try again.");
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login">
        <h1>LOGIN</h1>
        <p className="para">Welcome back!</p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email">Email Address:</label>
            <input
              className={email.error ? "invalid-input" : "input"}
              type="email"
              id="email"
              {...email}
            />
            <p className="login-error">{email.error}</p>
          </div>

          {/* Password */}
          <div className="login-password-input">
            <label htmlFor="password">Password:</label>
            <input
              className={password.error ? "invalid-input" : "input"}
              type={showPassword ? "text" : "password"}
              id="password"
              {...password}
            />
            <span onClick={togglePassword}>
              <img
                src={
                  showPassword
                    ? password.error
                      ? eyeOffCrimson
                      : eyeOffBlack
                    : password.error
                    ? eyeOnCrimson
                    : eyeOnBlack
                }
                className="login-eye"
                alt="Toggle Password"
              />
            </span>
            <p className="login-error">{password.error}</p>
          </div>

          {error && <p className="login-error">{error}</p>}

          {/* Submit */}
          <div className="login-red-btn">
            <button type="submit" className="btn-red" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="text-center">
            Don't have an account?{" "}
            <Link to="/register" className="register-here">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}