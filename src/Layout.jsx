import React, { useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "./context/userContext.jsx";
import { SidebarProvider } from "./context/sideBarContext.jsx";
import TopBar from "./components/TopBar";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import socket from "./socketConnection.js";
import axios from "axios";

const Layout = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, dispatch } = useContext(UserContext);
  const [isRefetching, setisRefetching] = useState(true);

  useEffect(() => {
    socket.emit("addUser", user._id);
    socket.on("getFollowed", (sourceUserId) => {
      dispatch({ type: "GET_FOLLOWED", payload: sourceUserId });
    });
    socket.on("getUnfollowed", (sourceUserId) => {
      dispatch({ type: "GET_UNFOLLOWED", payload: sourceUserId });
    });
    socket.on("getRequest", (sourceUserId) => {
      dispatch({ type: "GET_REQUEST", payload: sourceUserId });
    });
    socket.on("getRequestAccepted", (sourceUserId) => {
      dispatch({ type: "GET_REQUEST_ACCEPTED", payload: sourceUserId });
    });
    socket.on("getRequestRejected", (sourceUserId) => {
      dispatch({ type: "GET_REQUEST_REJECTED", payload: sourceUserId });
    });

    return () => {
      socket.off("getFollowed");
      socket.off("getUnfollowed");
      socket.off("getRequest");
      socket.off("getRequestAccepted");
      socket.off("getRequestRejected");
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${user._id}`);
        dispatch({ type: "REFETCH", payload: response.data });
        setisRefetching(false);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    }
    fetchUserData();
  }, [user._id]);

  if (isRefetching) return;

  return (
    <>
      <SidebarProvider>
        <TopBar />
        <div className="h-[calc(100vh-50px)] sm:h-[calc(100vh-58px)] grid grid-cols-16 bg-gray-100 dark:bg-[#171717]">
          <LeftBar />
          <div className="p-3 lg:p-5 lg:px-7 overflow-y-scroll scroll-smooth no-scrollbar col-span-full sm:col-span-10 lg:col-span-8">
            <Outlet />
          </div>
          <RightBar />
        </div>
      </SidebarProvider>
    </>
  );
};

export default Layout;
