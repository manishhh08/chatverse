import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../socketSetup/SocketContext";
import { getChatUsersAction, logoutAction } from "../features/users/userAction";
import { retrieveMessages } from "../features/messages/messageAction";
import { getChatsAction, useChatActions } from "../features/chats/chatAction";
import { addMessage } from "../features/messages/messageSlice";
import GroupChat from "../components/GroupChat";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";

const ChatLayout = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openChat, openChatById } = useChatActions();

  const chatWindowRef = useRef(null);
  const prevChatRef = useRef(null);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef(null);

  // Redux
  const { user, chatUsers = [] } = useSelector((store) => store.userStore);
  const { activeChat, chats } = useSelector((store) => store.chatStore);
  const { messagesByChat } = useSelector((store) => store.messageStore || {});
  const messages = activeChat ? messagesByChat[activeChat._id] || [] : [];

  useEffect(() => {
    dispatch(getChatUsersAction());
    dispatch(getChatsAction());
  }, [dispatch]);

  useEffect(() => {
    if (activeChat) {
      localStorage.setItem("activeChatId", activeChat._id);
    }
  }, [activeChat]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setSocketConnected(true);

      // Rejoin previously active chat
      const savedChatId = localStorage.getItem("activeChatId");
      if (savedChatId) {
        socket.emit("join_chat", savedChatId);
        openChatById(savedChatId);
      }
    };

    const handleDisconnect = () => setSocketConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !socketConnected || !activeChat) return;

    const chatId = activeChat._id;
    //leaving chats
    if (prevChatRef.current && prevChatRef.current !== chatId) {
      socket.emit("leave_chat", prevChatRef.current);
    }
    //rejoining the chat
    socket.emit("join_chat", chatId);
    prevChatRef.current = chatId;

    dispatch(retrieveMessages(chatId));

    const handleReceiveMessage = (message) => {
      if (message.chatId === chatId) {
        dispatch(addMessage({ chatId, message }));
      }
    };

    const handleTyping = ({ userId }) => {
      if (userId !== user._id) {
        setTypingUsers((prev) =>
          prev.includes(userId) ? prev : [...prev, userId]
        );
      }
    };

    const handleStopTyping = ({ userId }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, socketConnected, activeChat, dispatch]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLogout = () => {
    dispatch(logoutAction());
    toast.success("Logout successful");
    navigate("/", { replace: true });
  };

  const usersNotInChats = chatUsers.filter((u) => {
    if (u._id === user._id) return false;
    return !chats.some(
      (c) => !c.isGroup && c.members.some((m) => m._id === u._id)
    );
  });

  return (
    <Container fluid className="pt-2" style={{ height: "100vh" }}>
      <Row className="h-100" style={{ minHeight: 0 }}>
        {/* Sidebar */}
        <Col
          md={3}
          className="border-end d-flex flex-column"
          style={{ height: "100%", minHeight: 0 }}
        >
          <h5 className="py-2 border-bottom flex-shrink-0 text-white">Chats</h5>

          <div
            className="flex-grow-1 d-flex flex-column"
            style={{
              minHeight: 0,
              backgroundColor: "#1a1a1a",
              overflow: "hidden",
            }}
          >
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <UserList
              user={user}
              activeChat={activeChat}
              openChatById={openChatById}
              openChat={openChat}
              usersNotInChats={usersNotInChats}
              onCreateGroup={() => setShowGroupModal(true)}
              navigate={navigate}
              handleLogout={handleLogout}
              searchTerm={searchTerm}
            />
          </div>
        </Col>

        {/* Chat Window */}
        <Col
          md={9}
          xs={12}
          className="d-flex flex-column"
          style={{ height: "100%", minHeight: 0 }}
        >
          <ChatWindow
            activeChat={activeChat}
            messages={messages}
            user={user}
            typingUsers={typingUsers}
            chatWindowRef={chatWindowRef}
          />

          <MessageInput
            socket={socket}
            activeChat={activeChat}
            user={user}
            typingTimeoutRef={typingTimeoutRef}
          />
        </Col>
      </Row>

      <GroupChat
        show={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        users={chatUsers.filter((u) => u._id !== user._id)}
        currentUser={user}
      />
    </Container>
  );
};

export default ChatLayout;
