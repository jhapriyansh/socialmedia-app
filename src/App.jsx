import React, { useContext } from "react";
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./pages/Home.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Activity from "./pages/Activity.jsx";
import Chats from "./pages/Chats.jsx";
import Messages from "./pages/Messages.jsx";
import Liked from "./pages/Liked.jsx";
import Saved from "./pages/Saved.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/authContext.jsx";

const App = () => {
  const { token } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" />;
    return children;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="" element={<Home />} />
          <Route path="userProfile/:userId" element={<UserProfile />} />
          <Route path="chats" element={<Chats />} />
          <Route path="chats/:chatId/:senderId" element={<Messages />} />
          <Route path="activity" element={<Activity />} />
          <Route path="liked" element={<Liked />} />
          <Route path="saved" element={<Saved />} />
        </Route>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;