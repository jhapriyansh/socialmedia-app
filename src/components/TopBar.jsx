import React, { useContext, useEffect, useState } from "react";
import {
  GridViewOutlined,
  CloseOutlined,
  DarkMode,
  LightMode,
  SearchOutlined,
  EmailOutlined,
  NotificationsOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/themeContext";
import { UserContext } from "../context/userContext";
import { SidebarContext } from "../context/sideBarContext";
import axios from "axios";
import socket from "../socketConnection";
import { assets } from "../assets/assets";
import { AuthContext } from "../context/authContext";

const TopBar = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { theme, changeTheme } = useContext(ThemeContext);
  const { token } = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const { isOpen, toggleBar } = useContext(SidebarContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [unreadNotifications, setUnreadNotifications] = useState(false);
  const [unreadChats, setUnreadChats] = useState(false);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/${user._id}/has-unread`,
        { headers: { token } }
      );
      setUnreadNotifications(response.data.hasUnreadNotifications);
    } catch (error) {
      console.error("Error fetching unread notifications:", error.message);
    }
  }
  const fetchUnreadChats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/chats/${user._id}/has-unread`,
        { headers: { token } }
      );
      setUnreadChats(response.data.hasUnreadChats);
    } catch (error) {
      console.error("Error fetching unread chats:", error.message);
    }
  }

  useEffect(() => {
    fetchUnreadNotifications();
    fetchUnreadChats();
  }, [user._id]);

  useEffect(() => {
    socket.on("getNotification", fetchUnreadNotifications);
    socket.on("getMessage", fetchUnreadChats); 
    socket.on("checkUnreadNotifications", fetchUnreadNotifications);
    socket.on("checkUnreadChats", fetchUnreadChats);
    return () => {
      socket.off("getNotification", fetchUnreadNotifications);
      socket.off("getMessage", fetchUnreadChats);
      socket.off("checkUnreadNotifications", fetchUnreadNotifications);
      socket.off("checkUnreadChats", fetchUnreadChats);
    }
  }, [fetchUnreadChats, fetchUnreadNotifications]);

  const handleSearch = async (event) => {
    const { value: query } = event.target;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/users/search?username=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results: ", error.message);
      setSearchResults([]);
    }
  };

  return (
    <div className="flex bg-white z-20 items-center justify-between p-2 sm:p-2.5 shadow sticky top-0 dark:bg-[#101010] dark:text-white border-b border-b-white dark:border-opacity-10">
     
      <div className="flex justify-between items-center w-[68%]">
        <div className="sm:hidden mr-2">
          {isOpen ? (
            <CloseOutlined onClick={toggleBar} />
          ) : (
            <GridViewOutlined onClick={toggleBar} />
          )}
        </div>
        <div className="italianno-regular hidden sm:block text-2xl sm:text-[35px] sm:mx-3">
          SocialMedia-App
        </div>
        <div className="relative w-full lg:w-[630px]">
          <div className="flex items-center p-1 sm:p-1.5 rounded-md border border-gray-500 dark:border-opacity-40 w-full focus-within:ring-2 focus-within:ring-blue-400 focus-within:outline-none">
            <SearchOutlined />
            <input
              type="text"
              placeholder="Search..."
              className="ml-1 sm:ml-2 placeholder-black opacity-70 dark:placeholder-white bg-transparent outline-none w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-0.5 absolute bg-white dark:bg-[#101010] dark:text-white shadow rounded-b-md max-h-60 w-full overflow-y-auto z-10 border dark:border-white dark:border-opacity-10">
              {searchResults.map((result) => (
                <SearchResult
                  key={result._id}
                  user={result}
                  closeResults={() => {
                    setSearchResults([]);
                    setSearchQuery([]);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
  
      <div className="flex gap-2.5 sm:gap-5 items-center">
        {theme === "light" ? (
          <LightMode onClick={changeTheme} />
        ) : (
          <DarkMode onClick={changeTheme} />
        )}
        <Link to={`/chats`} className="relative">
          <EmailOutlined sx={{ fontSize: 27 }} />
          {unreadChats && (
            <div className="absolute top-1 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
          )}
        </Link>
        <Link to={`/activity`} className="relative">
          <NotificationsOutlined sx={{ fontSize: 27 }} />
          {unreadNotifications && (
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </Link>
        <div className="hidden sm:block">
          <img
            src={user.profilePicture || assets.noAvatar}
            alt="userImage"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full mr-2 object-cover shadow"
          />
        </div>
      </div>
    </div>
  );
};

const SearchResult = ({ user, closeResults }) => {

  return (
    <div className="flex items-center justify-between">
      <Link
        onClick={closeResults}
        to={`/userProfile/${user._id}`}
        className="px-4 py-2 flex gap-3 sm:gap-4 items-center w-full hover:bg-gray-100 dark:hover:bg-[#171717]"
      >
        <img
          src={user.profilePicture || assets.noAvatar}
          className="block h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover"
          alt="user image"
        />
        <p>{user.username}</p>
      </Link>
    </div>
  );
};

export default TopBar;
