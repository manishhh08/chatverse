import { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../socketSetup/SocketContext";
import { getChatUsersAction, logoutAction } from "../features/users/userAction";
import {
  retrieveMessages,
  sendMessageAction,
} from "../features/messages/messageAction";
import { getChatsAction, useChatActions } from "../features/chats/chatAction";
import { addMessage } from "../features/messages/messageSlice";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import GroupChat from "../components/GroupChat";
import { setActiveChat } from "../features/chats/chatSlice";
import { FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChatLayout = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openChat } = useChatActions();
  const chatWindowRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const prevChatRef = useRef(null);

  // Redux
  const { user, chatUsers = [] } = useSelector((store) => store.userStore);
  const { activeChat, chats } = useSelector((store) => store.chatStore);
  const { messagesByChat } = useSelector((store) => store.messageStore || {});
  const messages = activeChat ? messagesByChat[activeChat._id] || [] : [];

  // Persist active chat to localStorage
  useEffect(() => {
    if (activeChat) localStorage.setItem("activeChatId", activeChat._id);
  }, [activeChat]);

  useEffect(() => {
    dispatch(getChatUsersAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getChatsAction());
  }, [dispatch]);

  // useEffect(() => {
  //   const savedChatId = localStorage.getItem("activeChatId");
  //   if (!savedChatId || activeChat || chats.length === 0) return;

  //   const savedChat = chats.find((c) => c._id === savedChatId);
  //   if (savedChat) {
  //     dispatch(setActiveChat(savedChat));
  //     dispatch(retrieveMessages(savedChat._id));
  //     if (socket) socket.emit("join_chat", savedChat._id);
  //   }
  // }, [chats, activeChat, dispatch, socket]);

  // useEffect(() => {
  //   if (!activeChat || !socket) return;

  //   dispatch(retrieveMessages(activeChat._id));
  //   socket.emit("join_chat", activeChat._id);

  //   const handleReceiveMessage = (message) => {
  //     if (message.chatId === activeChat._id) {
  //       dispatch(addMessage({ chatId: activeChat._id, message }));
  //     }
  //   };

  //   socket.on("receive_message", handleReceiveMessage);
  //   return () => socket.off("receive_message", handleReceiveMessage);
  // }, [activeChat, socket, dispatch]);

  // useEffect(() => {
  //   if (!activeChat) return;

  //   dispatch(retrieveMessages(activeChat._id));
  // }, [activeChat, dispatch]);

  // Socket join/leave

  useEffect(() => {
    if (!activeChat || !socket) return;

    // Leave previous chat if any
    if (prevChatRef.current && prevChatRef.current !== activeChat._id) {
      socket.emit("leave_chat", prevChatRef.current);
    }

    // Join new chat
    socket.emit("join_chat", activeChat._id);
    prevChatRef.current = activeChat._id;

    // Fetch messages for this chat
    dispatch(retrieveMessages(activeChat._id));

    // Listen for incoming messages
    const handleReceiveMessage = (message) => {
      if (message.chatId === activeChat._id) {
        dispatch(addMessage({ chatId: activeChat._id, message }));
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => socket.off("receive_message", handleReceiveMessage);
  }, [activeChat, socket, dispatch]);
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat || !user) return;

    const message = {
      chatId: activeChat._id,
      text: messageInput,
      senderId: user._id,
      senderName: user.firstName,
    };

    dispatch(sendMessageAction(message));
    setMessageInput("");
  };

  const filteredChatUsers = user
    ? chatUsers.filter((u) => u._id !== user._id)
    : [];

  const handleLogout = () => {
    dispatch(logoutAction());
    toast.success("Logout successful");
    navigate("/", { replace: true });
  };

  return (
    <Container fluid className="pt-2" style={{ height: "100vh" }}>
      <Row className="h-100" style={{ minHeight: 0 }}>
        {/* Users List */}
        <Col
          md={3}
          className="border-end d-flex flex-column"
          style={{ height: "100%", minHeight: 0 }}
        >
          <h5 className="py-2 border-bottom flex-shrink-0 text-white">Chats</h5>

          <div
            className="flex-grow-1 d-flex flex-column"
            style={{ minHeight: 0, backgroundColor: "#1a1a1a" }}
          >
            {/* Search Bar */}
            <div className="p-2 mb-2">
              <style>
                {`
      .chat-input::placeholder {
        color: #ffffff;  /* white text */
        opacity: 1;      /* make sure it’s fully opaque */
      }
    `}
              </style>
              <Form.Control
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark text-white border border-secondary chat-input"
                style={{ fontSize: "14px", minHeight: "40px" }}
              />
            </div>

            {/* User List */}
            <div className="flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
              {chatUsers.length === 0 ? (
                <div className="text-center mt-3 text-white">
                  <Spinner animation="border" size="sm" /> Loading users...
                </div>
              ) : filteredChatUsers.length === 0 ? (
                <div className="text-center mt-3 text-muted">
                  No other users
                </div>
              ) : (
                <ListGroup variant="flush" className="bg-dark text-white">
                  {filteredChatUsers.map((u) => {
                    const isActive = activeChat?.members?.some(
                      (m) => m._id === u._id
                    );
                    return (
                      <ListGroup.Item
                        key={u._id}
                        action
                        onClick={() => openChat(u._id)}
                        className={`d-flex align-items-center ${
                          isActive
                            ? "bg-primary text-white"
                            : "bg-dark text-white"
                        }`}
                        style={{ cursor: "pointer", minHeight: "50px" }}
                      >
                        <div className="flex-grow-1 d-flex align-items-center">
                          <strong>
                            {u.firstName} {u.lastName}
                          </strong>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </div>

            {/* Bottom Buttons */}
            <div className="mt-auto d-flex flex-column gap-2 p-2">
              <Button
                variant="primary"
                className="d-flex align-items-center justify-content-center gap-2 w-100"
                onClick={() => setShowGroupModal(true)}
              >
                ➕ Create Group
              </Button>

              <Button
                variant="outline-primary"
                className="d-flex align-items-center justify-content-center gap-2 w-100"
                onClick={() => console.log("User Details")}
              >
                <FaUser /> User Details
              </Button>

              <Button
                variant="outline-danger"
                className="d-flex align-items-center justify-content-center gap-2 w-100"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </Button>
            </div>
          </div>
        </Col>

        {/* Chat Window */}
        <Col
          md={9}
          xs={12}
          className="d-flex flex-column"
          style={{ height: "100%", minHeight: 0 }}
        >
          {activeChat ? (
            <>
              {/* Header */}
              <div className="border-bottom p-2 flex-shrink-0 bg-dark text-white">
                {activeChat.isGroup ? (
                  <strong>{activeChat.name}</strong>
                ) : (
                  (() => {
                    const otherUser = activeChat.members.find(
                      (m) => m._id !== user._id
                    );
                    return (
                      <strong>
                        Chat with {otherUser?.firstName} {otherUser?.lastName}
                      </strong>
                    );
                  })()
                )}
              </div>

              {/* Messages */}
              <div
                ref={chatWindowRef}
                className="overflow-auto p-3 flex-grow-1"
                style={{
                  minHeight: 0,
                  backgroundColor: "#1a1a1a",
                }}
              >
                {messages.map((msg) => {
                  const isMine = msg.senderId._id === user._id;
                  const senderName = isMine ? "You:" : msg.senderId.firstName;

                  return (
                    <div
                      key={msg._id}
                      className={`d-flex mb-2 ${
                        isMine ? "justify-content-end" : "justify-content-start"
                      }`}
                    >
                      <div
                        className={`p-2 rounded ${
                          isMine
                            ? "bg-primary text-white"
                            : "bg-success text-white"
                        }`}
                        style={{
                          maxWidth: "70%",
                          wordBreak: "break-word",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      >
                        <strong style={{ fontSize: "12px" }}>
                          {senderName}:
                        </strong>
                        <div style={{ fontSize: "14px", marginTop: "2px" }}>
                          {msg.text}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#aaa",
                            textAlign: isMine ? "right" : "left",
                            marginTop: "2px",
                          }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="d-flex p-3 border-top flex-shrink-0">
                <style>
                  {`
      .chat-input::placeholder {
        color: #f8f9fa; 
        opacity: 1;
      }
    `}
                </style>
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="me-2 border-0 chat-input"
                  style={{
                    fontSize: "14px",
                    color: "white", // typed text
                    backgroundColor: "#343a40",
                    minHeight: "40px",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <FiSend />
                </Button>
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
              Select a chat to start messaging
            </div>
          )}
        </Col>
      </Row>

      <GroupChat
        show={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        users={filteredChatUsers}
        currentUser={user}
      />
    </Container>
  );
};

export default ChatLayout;
