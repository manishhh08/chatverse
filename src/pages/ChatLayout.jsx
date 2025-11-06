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
import { getChatUsersAction } from "../features/users/userAction";
import {
  retrieveMessages,
  sendMessageAction,
} from "../features/messages/messageAction";
import { useChatActions } from "../features/chats/chatAction";
import { addMessage } from "../features/messages/messageSlice";

const ChatLayout = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { openChat } = useChatActions();
  const chatWindowRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");

  // Redux
  const { user, chatUsers = [] } = useSelector((store) => store.userStore);
  const { activeChat } = useSelector((store) => store.chatStore);
  const messagesByChat = useSelector(
    (store) => store.message?.messagesByChat || {}
  );
  const messages = activeChat ? messagesByChat[activeChat._id] || [] : [];

  // Fetch chat users once
  useEffect(() => {
    dispatch(getChatUsersAction());
  }, [dispatch]);

  useEffect(() => {
    if (!activeChat || !socket) return;

    // Fetch existing messages from backend
    dispatch(retrieveMessages(activeChat._id));

    // Join chat room
    socket.emit("join_chat", activeChat._id);

    // Listen for new incoming messages
    const handleReceiveMessage = (message) => {
      // Only add if it belongs to the current chat
      if (message.chatId === activeChat._id) {
        dispatch(addMessage({ chatId: activeChat._id, message }));
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [activeChat, socket, dispatch]);

  // Scroll chat window when messages change
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
    socket.emit("send_message", message);
    setMessageInput("");
  };

  // Filter out current user from chat users list
  const filteredChatUsers = user
    ? chatUsers.filter((u) => u._id !== user._id)
    : [];

  return (
    <Container fluid className="pt-2" style={{ height: "100vh" }}>
      <Row className="h-100">
        {/* Users List */}
        <Col md={3} className="border-end overflow-auto">
          <h5 className="py-2 border-bottom">Chats</h5>
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
        </Col>

        {/* Chat Window */}
        <Col md={9} xs={12} className="d-flex flex-column">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="border-bottom p-2">
                <strong>
                  {activeChat.isGroup
                    ? activeChat.name
                    : activeChat.members.find((m) => m._id !== user._id)
                        ?.firstName}
                </strong>
              </div>

              {/* Messages */}
              <div
                ref={chatWindowRef}
                className="flex-grow-1 overflow-auto p-3"
                style={{ background: "#f8f9fa" }}
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
                            : "bg-light text-dark"
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
              <div className="d-flex p-3 border-top">
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
    </Container>
  );
};

export default ChatLayout;
