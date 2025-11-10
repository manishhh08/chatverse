import { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  ListGroup,
  Spinner,
  Tooltip,
  OverlayTrigger,
  Accordion,
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
import { FaSignOutAlt, FaSmile, FaUser } from "react-icons/fa";
import { FiMessageSquare, FiSend, FiUsers } from "react-icons/fi";
import GroupChat from "../components/GroupChat";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

const ChatLayout = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openChat, openChatById } = useChatActions();

  const chatWindowRef = useRef(null);
  const prevChatRef = useRef(null);
  const restoredRef = useRef(false);

  const [messageInput, setMessageInput] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Redux
  const { user, chatUsers = [] } = useSelector((store) => store.userStore);
  const { activeChat, chats } = useSelector((store) => store.chatStore);
  const { messagesByChat } = useSelector((store) => store.messageStore || {});
  const messages = activeChat ? messagesByChat[activeChat._id] || [] : [];

  const directChats = chats.filter((c) => !c.isGroup);
  const groupChats = chats.filter((c) => c.isGroup);

  const filteredDirectChats = directChats.filter((c) => {
    if (!searchTerm) return true;
    const otherUser = c.members.find((m) => m._id !== user._id);
    return otherUser?.firstName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const filteredGroupChats = groupChats.filter((c) => {
    if (!searchTerm) return true;
    return c.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getInitials = (user) =>
    `${user?.firstName[0] || ""}${user?.lastName[0] || ""}`.toUpperCase();

  useEffect(() => {
    if (activeChat) localStorage.setItem("activeChatId", activeChat._id);
  }, [activeChat]);

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

    socket.emit("stop_typing", { chatId: activeChat._id, userId: user._id });
    setIsTyping(false);
  };

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

  const renderChatList = (chatList, isGroup = false) => (
    <ListGroup variant="flush" className="bg-dark text-white">
      {chatList.map((c) => {
        const isActive = activeChat?._id === c._id;
        const displayName = isGroup
          ? c.name
          : c.members.find((m) => m._id !== user._id)?.firstName || "Unknown";
        const unreadCount = c.unreadCount || 0;

        return (
          <ListGroup.Item
            key={c._id}
            action
            onClick={() => dispatch(openChatById(c._id))}
            className={`d-flex align-items-center ${
              isActive ? "bg-primary text-white" : "bg-dark text-white"
            }`}
            style={{ cursor: "pointer", minHeight: "50px" }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: isGroup ? "#34e89e4d" : "#e3a74d2a",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {isGroup ? (
                <FiUsers />
              ) : (
                getInitials(c.members.find((m) => m._id !== user._id))
              )}
            </div>
            <div className="flex-grow-1 d-flex align-items-center justify-content-between">
              <strong>{displayName}</strong>
              {unreadCount > 0 && (
                <span className="badge bg-danger ms-2">{unreadCount}</span>
              )}
            </div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );

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

          {/* Scrollable content */}
          <div
            className="flex-grow-1 d-flex flex-column"
            style={{
              minHeight: 0,
              backgroundColor: "#1a1a1a",
              overflow: "hidden",
            }}
          >
            {/* Search */}
            <div className="p-2 flex-shrink-0">
              <Form.Control
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark text-white border border-secondary chat-input"
                style={{ fontSize: "14px", minHeight: "40px" }}
              />
            </div>

            {/* Chat lists container scrollable */}
            <div
              className="flex-grow-1 overflow-auto"
              style={{ minHeight: 0, padding: "0 0.5rem" }}
            >
              {/* Direct Chats */}
              <div className="mb-3">
                <h6 className="text-white">Direct Chats</h6>
                {filteredDirectChats.length ? (
                  renderChatList(filteredDirectChats)
                ) : (
                  <div className="text-muted text-center py-2">
                    No direct chats
                  </div>
                )}
              </div>

              {/* Group Chats */}
              <div className="mb-3">
                <h6 className="text-white">Group Chats</h6>
                {filteredGroupChats.length ? (
                  renderChatList(filteredGroupChats, true)
                ) : (
                  <div className="text-light text-center py-2">
                    No group chats
                  </div>
                )}
              </div>

              {/* Start new chat */}
              <Accordion defaultActiveKey="0" flush>
                <Accordion.Item
                  eventKey="0"
                  disabled={usersNotInChats.length === 0}
                  className="bg-dark text-white border-0"
                >
                  <Accordion.Header
                    className="bg-dark text-white"
                    style={{
                      backgroundColor: "#1a1a1a",
                      color: "white",
                    }}
                  >
                    Start New Chat
                  </Accordion.Header>

                  <Accordion.Body
                    style={{ padding: 0, backgroundColor: "#1a1a1a" }}
                  >
                    {usersNotInChats.length > 0 ? (
                      <ListGroup variant="flush" className="bg-dark text-white">
                        {usersNotInChats.map((u) => (
                          <ListGroup.Item
                            key={u._id}
                            action
                            onClick={() => dispatch(openChat(u._id))}
                            className="d-flex align-items-center bg-dark text-white"
                          >
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: "#e3a74d2a",
                                fontWeight: "600",
                                fontSize: "16px",
                              }}
                            >
                              {u.firstName[0].toUpperCase()}
                              {u.lastName[0]?.toUpperCase()}
                            </div>
                            <strong>
                              {u.firstName} {u.lastName}
                            </strong>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-center text-light py-2">
                        No users to start chat
                      </div>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>

            {/* Bottom Buttons */}
            <div className="mt-auto d-flex flex-column gap-2 p-2 flex-shrink-0">
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
                onClick={() => navigate("/detail")}
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
              <div className="border-bottom p-2 flex-shrink-0 bg-dark text-white d-flex justify-content-between align-items-center">
                <div>
                  {activeChat.isGroup ? (
                    <strong>
                      Group Chat:{" "}
                      {activeChat.name.charAt(0).toUpperCase() +
                        activeChat.name.slice(1)}
                    </strong>
                  ) : (
                    (() => {
                      const otherUser = activeChat.members.find(
                        (m) => m._id !== user._id
                      );
                      const firstName =
                        otherUser?.firstName.charAt(0).toUpperCase() +
                        otherUser?.firstName.slice(1);
                      const lastName =
                        otherUser?.lastName.charAt(0).toUpperCase() +
                        otherUser?.lastName.slice(1);
                      return (
                        <strong>
                          Chat with {firstName} {lastName}
                        </strong>
                      );
                    })()
                  )}
                </div>

                {/* Group Members */}
                {activeChat.isGroup && (
                  <div
                    className="d-flex align-items-center gap-1 flex-wrap"
                    style={{ maxWidth: "50%" }}
                  >
                    {activeChat.members.map((member) => (
                      <OverlayTrigger
                        key={member._id}
                        placement="bottom"
                        overlay={
                          <Tooltip id={`tooltip-${member._id}`}>
                            {member.firstName} {member.lastName}
                          </Tooltip>
                        }
                      >
                        <div
                          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                          style={{
                            width: "30px",
                            height: "30px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          {member.firstName[0].toUpperCase()}
                          {member.lastName[0]?.toUpperCase()}
                        </div>
                      </OverlayTrigger>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div
                ref={chatWindowRef}
                className="overflow-auto p-3 flex-grow-1 d-flex flex-column"
                style={{ minHeight: 0, backgroundColor: "#1a1a1a" }}
              >
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMine = msg.senderId._id === user._id;
                    const senderName = isMine ? "You" : msg.senderId.firstName;
                    return (
                      <div
                        key={msg._id}
                        className={`d-flex mb-2 ${
                          isMine
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >
                        <div
                          className="text-white"
                          style={{
                            maxWidth: "50%",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            display: "inline-block",
                            marginLeft: isMine ? "10px" : "0",
                            marginRight: isMine ? "0" : "10px",
                            borderRadius: "20px",
                            animation: "fadeIn 0.3s ease-in-out",
                            background: isMine
                              ? "linear-gradient(135deg, #4e54c8, #8f94fb)"
                              : "linear-gradient(135deg, #34e89e, #0f3443)",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                            padding: "10px",
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
                              color: "#eee",
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
                  })
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center text-muted">
                    <FiMessageSquare
                      size={60}
                      className="mb-3 text-secondary"
                    />
                    <h5 className="text-white mb-2">No messages yet</h5>
                    <p className="text-light mb-3">
                      Start the conversation by typing a message{" "}
                      <FiSend className="ms-1" />
                    </p>
                  </div>
                )}
              </div>

              <div
                style={{
                  minHeight: "20px",
                  color: "#ccc",
                  fontSize: "12px",
                  paddingLeft: "12px",
                }}
              >
                {typingUsers.length > 0 && (
                  <div className="px-3 text-muted small">
                    {typingUsers.length === 1
                      ? `${typingUsers
                          .map(
                            (id) =>
                              activeChat.members.find((m) => m._id === id)
                                ?.firstName
                          )
                          .join(", ")} is typing...`
                      : "Multiple users are typing..."}
                  </div>
                )}
              </div>

              {/* emoji support */}
              {showEmojiPicker && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "70px",
                    right: "20px",
                    zIndex: 2000,
                  }}
                >
                  <EmojiPicker
                    theme="dark"
                    onEmojiClick={(emoji) => {
                      setMessageInput((prev) => prev + emoji.emoji);
                    }}
                  />
                </div>
              )}
              {/* Input */}
              <div
                className="d-flex p-3 border-top flex-shrink-0"
                style={{ position: "relative" }}
              >
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                    if (!isTyping && activeChat) {
                      setIsTyping(true);
                      socket.emit("typing", {
                        chatId: activeChat._id,
                        userId: user._id,
                      });
                    }
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => {
                      setIsTyping(false);
                      if (activeChat) {
                        socket.emit("stop_typing", {
                          chatId: activeChat._id,
                          userId: user._id,
                        });
                      }
                    }, 2000);
                  }}
                  className="me-2 border-0 chat-input"
                  style={{
                    fontSize: "14px",
                    color: "white",
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

                {/* Emoji Toggle Button */}
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  <FaSmile size={18} />
                </Button>

                {/* Send Button */}
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
        users={chatUsers.filter((u) => u._id !== user._id)}
        currentUser={user}
      />
    </Container>
  );
};

export default ChatLayout;
