import { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { useFormInput } from "../hooks/useFormInput";
import { useTogglePassword } from "../hooks/useTogglePassword";

import eyeOnBlack from "../assets/eye-fill-black.svg";
import eyeOffBlack from "../assets/eye-slash-fill-black.svg";
import eyeOnCrimson from "../assets/eye-fill-crimson.svg";
import eyeOffCrimson from "../assets/eye-slash-fill-crimson.svg";
import defimg from "../assets/defimgprev.png"

export function Register() {
    const navigate = useNavigate();

    const username = useFormInput("", (val) => val.trim().length >= 3, "Username is required");
    const email = useFormInput("", (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Enter a valid email");
    const password = useFormInput("", (val) => val.length >= 6, "Password must be at least 6 characters");
    const confirmPassword = useFormInput("", (val) => val === password.value, "Passwords must match");

    const [showPassword, togglePassword] = useTogglePassword();
    const [showConfirmPassword, toggleConfirmPassword] = useTogglePassword();

    const [imagePreview, setImagePreview] = useState("");
    const [base64Image, setBase64Image] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (1MB = 1048576 bytes)
            if (file.size > 1048576) {
                toast.error("Image size should be under 1MB");
                return;
            }

            setImagePreview(URL.createObjectURL(file));

            // Convert to base64 and store
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                setBase64Image(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        if (!username.value) { username.setError("Username is required"); hasError = true; }
        if (!email.value) { email.setError("Email is required"); hasError = true; }
        if (!password.value) { password.setError("Password is required"); hasError = true; }
        if (!confirmPassword.value) { confirmPassword.setError("Please confirm password"); hasError = true; }
        if (confirmPassword.value !== password.value) { confirmPassword.setError("Passwords must match"); hasError = true; }

        if (hasError) return;

        // You can't upload file directly to local folder in production from browser. You'd need a backend or manual copy during dev.
        const newUser = {
            username: username.value,
            email: email.value,
            password: password.value,
            userImage: base64Image || defimg,
        };

        try {
            await axios.post("https://686faa6c91e85fac42a203ee.mockapi.io/users", newUser);
            toast.success("registered Successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Error saving user to API", error);
            toast.error("Failed to Register. Try again.");
        }

        // Clear form
        username.setValue(""); email.setValue("");
        password.setValue(""); confirmPassword.setValue("");
        setImagePreview("");
    };

    return (
        <div className="register-bg">
            <div className="register">
                <h1>Register</h1>
                <p className="para">Let's create new account</p>

                <form onSubmit={handleSubmit}>
                    {/* Image Preview */}
                    <div className="image-upload-container">
                        <img
                            src={imagePreview ? imagePreview : defimg}
                            alt="Preview"
                            className="profile-image"
                        />
                        <label htmlFor="imageUpload" className="upload-btn">+</label>
                        <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            className={username.error ? "invalid-input" : "input"}
                            type="text"
                            id="username"
                            {...username}
                        />
                        <p className="register-error">{username.error}</p>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email">Email Address:</label>
                        <input
                            className={email.error ? "invalid-input" : "input"}
                            type="email"
                            id="email"
                            {...email}
                        />
                        <p className="register-error">{email.error}</p>
                    </div>

                    {/* Password */}
                    <div className="register-password-input">
                        <label htmlFor="password">Password:</label>
                        <input
                            className={password.error ? "invalid-input" : "input"}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            {...password}
                        />
                        <span onClick={togglePassword}>
                            <img src={showPassword ? (password.error ? eyeOffCrimson : eyeOffBlack) : (password.error ? eyeOnCrimson : eyeOnBlack)} className="register-eye" />
                        </span>
                        <p className="register-error">{password.error}</p>
                    </div>

                    {/* Confirm Password */}
                    <div className="register-password-input">
                        <label htmlFor="ConfirmPassword">Confirm Password:</label>
                        <input
                            className={confirmPassword.error ? "invalid-input" : "input"}
                            type={showConfirmPassword ? "text" : "password"}
                            id="ConfirmPassword"
                            {...confirmPassword}
                        />
                        <span onClick={toggleConfirmPassword}>
                            <img src={showConfirmPassword ? (confirmPassword.error ? eyeOffCrimson : eyeOffBlack) : (confirmPassword.error ? eyeOnCrimson : eyeOnBlack)} className="register-eye" />
                        </span>
                        <p className="register-error">{confirmPassword.error}</p>
                    </div>

                    {/* Submit */}
                    <div className="register-red-btn">
                        <button type="submit" className="btn-red">Register</button>
                    </div>
                    <p className="text-center">
                        Already have an account? <Link to="/login" className="login-here">Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}