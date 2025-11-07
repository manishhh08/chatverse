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

const ChatLayout = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { openChat, openChatById } = useChatActions();
  const chatWindowRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);

  // Redux
  const { user, chatUsers = [] } = useSelector((store) => store.userStore);
  const { activeChat, chats } = useSelector((store) => store.chatStore);
  const { messagesByChat } = useSelector((store) => store.messageStore || {});
  const messages = activeChat ? messagesByChat[activeChat._id] || [] : [];

  // Persist active chat to localStorage
  useEffect(() => {
    if (activeChat) {
      localStorage.setItem("activeChatId", activeChat._id);
    }
  }, [activeChat]);

  useEffect(() => {
    dispatch(getChatUsersAction());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getChatsAction());
  }, [dispatch]);

  useEffect(() => {
    const savedChatId = localStorage.getItem("activeChatId");
    if (!savedChatId || activeChat || chats.length === 0) return;

    const savedChat = chats.find((c) => c._id === savedChatId);
    if (savedChat) {
      dispatch(setActiveChat(savedChat)); // restore chat
      dispatch(retrieveMessages(savedChat._id)); // fetch messages
      if (socket) socket.emit("join_chat", savedChat._id); // join socket room
    }
  }, [chats, activeChat, dispatch, socket]);
  // Fetch messages & listen for new messages
  useEffect(() => {
    if (!activeChat || !socket) return;

    dispatch(retrieveMessages(activeChat._id));
    socket.emit("join_chat", activeChat._id);

    const handleReceiveMessage = (message) => {
      if (message.chatId === activeChat._id) {
        dispatch(addMessage({ chatId: activeChat._id, message }));
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => socket.off("receive_message", handleReceiveMessage);
  }, [activeChat, socket, dispatch]);

  // Auto-scroll chat window
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message
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

  // Filter out current user from chat users list
  const filteredChatUsers = user
    ? chatUsers.filter((u) => u._id !== user._id)
    : [];

  const handleLogout = () => {
    dispatch(logoutAction());
    toast.success("Logout successful");
    navigate("/", { replace: true, state: {} });
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
          <h5 className="py-2 border-bottom flex-shrink-0">Chats</h5>

          <div className="flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
            {chatUsers.length === 0 ? (
              <div className="text-center mt-3">
                <Spinner animation="border" size="sm" /> Loading users...
              </div>
            ) : filteredChatUsers.length === 0 ? (
              <div className="text-center mt-3 text-muted">No other users</div>
            ) : (
              <ListGroup variant="flush">
                {filteredChatUsers.map((u) => (
                  <ListGroup.Item
                    key={u._id}
                    action
                    active={activeChat?.members?.some((m) => m._id === u._id)}
                    onClick={() => openChat(u._id)}
                    className="d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="flex-grow-1">
                      <strong>
                        {u.firstName} {u.lastName}
                      </strong>
                      <div className="text-muted" style={{ fontSize: "12px" }}>
                        {u.lastMessage || "No messages yet"}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
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
              <div className="border-bottom p-2 flex-shrink-0 bg-dark">
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
                className="overflow-auto p-3"
                style={{
                  flexGrow: 1,
                  minHeight: 0,
                  background: "#f8f9fa",
                }}
              >
                {messages.map((msg) => {
                  const isMine = msg.senderId._id === user._id;
                  const senderName = isMine ? "You" : msg.senderId.username;

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
                            : "bg-success text-dark"
                        }`}
                        style={{ maxWidth: "70%" }}
                      >
                        <strong style={{ fontSize: "12px" }}>
                          {senderName}
                        </strong>
                        <div>{msg.text}</div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#666",
                            textAlign: isMine ? "right" : "left",
                          }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="d-flex p-3 border-top flex-shrink-0">
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="me-2"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>Send</Button>
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
