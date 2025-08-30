import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { format } from "timeago.js";
import CircleIcon from "@mui/icons-material/Circle";
import BlockIcon from "@mui/icons-material/Block";
import socket from "../socketConnection";
import ChatSkeleton from "../components/skeletons/ChatSkeleton";
import { OnlineUsersContext } from "../context/onlineUsersContext";
import { assets } from "../assets/assets";
import { AuthContext } from "../context/authContext";

const Chats = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/chats/${user._id}`,
          { headers: { token } }
        );
        setChats(response.data);
      } catch (error) {
        console.error("Failed to fetch chats:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();

    socket.on("getMessage", fetchChats);
    return () => socket.off("getMessage");
  }, [user._id]);

  return (
    <div className="h-[100%] shadow-md bg-white dark:bg-[#101010] dark:text-white rounded-lg">
      <div className="p-4 flex justify-center items-center">
        <h4 className="font-bold text-2xl">Chats</h4>
      </div>
      <hr className="border border-black dark:border-white opacity-15" />
      <div className="overflow-hidden overflow-y-scroll scroll-smooth scrollbar-thin pl-2 h-[85%]">
        {isLoading 
          ? Array.from({ length: 10 }).map((_, index) => (
            <ChatSkeleton key={index} />
          ))
          : chats.length > 0 ? chats.map((chat) => (
            <ChatItem key={chat._id} chat={chat} sender={chat.sender} />
          ))
          : <div className="h-full px-5 flex items-center justify-center dark:text-white">
              <div className="text-center">
                <p className="text-2xl font-medium mb-2">No conversations yet.</p>
                <p className="text-lg opacity-80">Start chatting with someone today!</p>
              </div>
            </div>}
      </div>
    </div>
  );
};

const ChatItem = ({ chat, sender }) => {
  const { user: currentUser } = useContext(UserContext);
  const isBlocked = currentUser.blockedUsers.includes(sender._id);
  const { onlineUsers } = useContext(OnlineUsersContext);

  return (
    <>
      {chat.lastMessage && (
        <div>
          <Link
            to={`/chats/${chat._id}/${sender._id}`}
            className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-[#202020] px-4 py-3"
          >
            <div className="flex gap-4 items-center w-full">
              <img
                src={sender.profilePicture || assets.noAvatar}
                className="block h-12 w-12 rounded-full object-cover"
                alt="sender image"
              />
              <div>
                <div className="flex gap-2 items-center">
                  <p className="text-lg">
                    {sender.username} {isBlocked && <span className="opacity-50"><BlockIcon /></span>}
                  </p>
                  {onlineUsers.includes(sender._id) && <div className="mt-0.5 h-2.5 w-2.5 bg-green-500 rounded-full"></div>}
                </div>
                <p className="opacity-60 text-sm">
                  {isBlocked ? "You blocked this user" : <span>
                    {chat.lastMessage.content.length > 50 ?
                      <>{chat.lastMessage.content.substring(0,36)}...</>
                      : chat.lastMessage.content
                    } 
                    {" "}<CircleIcon sx={{ fontSize: 4 }} />{" "}
                    {format(chat.lastMessage.createdAt)}
                  </span>}
                </p>
              </div>
            </div>
            {chat.unreadMessagesCount > 0 &&
              chat.lastMessage.senderId !== currentUser._id && (
                <div className="h-6 w-6 flex items-center justify-center text-center rounded-full bg-blue-500 text-white text-sm font-semibold shadow-md">
                  {chat.unreadMessagesCount}
                </div>
              )}
          </Link>
          <hr className="border border-black dark:border-white opacity-15" />
        </div>
      )}
    </>
  );
};

export default Chats;
