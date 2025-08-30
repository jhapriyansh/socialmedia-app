import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { ThemeContext } from "../context/themeContext";
import axios from "axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { DarkMode, LightMode } from '@mui/icons-material';
import { AuthContext } from "../context/authContext";

const Login = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { setToken } = useContext(AuthContext);
  const { dispatch } = useContext(UserContext);
  const { theme, changeTheme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginUser = async (userCredentials, dispatch) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, userCredentials);
      dispatch({ type: "LOGIN", payload: response.data.user });
      setToken(response.data.token);
      toast.success("logged in successfully", { theme });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setUsernameError(error.response.data.message);
      } else if (error.response && error.response.status === 400) {
        setPasswordError(error.response.data.message);
      } else {
        toast.error("Failed to login", { theme });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userCredentials = {
      username: formData.username,
      password: formData.password
    }
    loginUser(userCredentials, dispatch);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({...formData, [name]: value});
    if (name === "username") setUsernameError("");
    if (name === "password") setPasswordError("");
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#171717] flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-gray-50 dark:bg-[#101010] shadow-equal rounded-lg p-6">
        <h2 className="text-[35px] sm:text-[45px] text-center dark:text-white italianno-regular">SocialMedia-App</h2>
        <p className="sm:text-lg text-center text-gray-600 dark:text-gray-400 mb-4">
          Log in to your account.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={`mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-[#171717] text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${theme === "dark" && "custom-autofill"}`}
                placeholder="Enter your username"
                onChange={handleChange}
                value={formData.username}
              />
              {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-[#171717] text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your password"
                onChange={handleChange}
                value={formData.password}
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-500 transition ease-in-out duration-200"
          >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : "Log in"}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <button onClick={changeTheme} className="fixed bottom-4 right-4 bg-gray-50 dark:bg-[#101010] border border-gray-600 rounded-lg dark:text-white p-3 z-50" >
        {theme === 'light' ? (
          <LightMode sx={{ fontSize: 27 }} />
        ) : (
          <DarkMode sx={{ fontSize: 27 }} />
        )}
      </button>
    </div>
  );
};

export default Login;
