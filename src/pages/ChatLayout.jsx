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
import { getStoredUser } from "../utils/storageFunction";

const ChatLayout = () => {
  const socket = useSocket();
  const dispatch = useDispatch();

  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const chatWindowRef = useRef(null);

  // Redux
  const { user, chatUsers = [] } = useSelector((store) => store.userStore);
  const messagesByChat = useSelector(
    (store) => store.message?.messagesByChat || {}
  );

  const messages = activeChat ? messagesByChat[activeChat._id] || [] : [];

  // Load logged-in user from storage
  useEffect(() => {
    const user = getStoredUser();
    if (user) setUser(user);
  }, []);

  // Fetch chat users once logged-in user is loaded
  useEffect(() => {
    dispatch(getChatUsersAction());
  }, [dispatch]);

  // Load messages when a chat is selected
  useEffect(() => {
    if (activeChat) {
      dispatch(retrieveMessages(activeChat._id));
      socket?.emit("join_chat", activeChat._id);
    }
  }, [activeChat, dispatch, socket]);

  // Auto scroll chat window
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      dispatch(sendMessageAction(message));
    };

    socket.on("receive_message", handleNewMessage);
    return () => socket.off("receive_message", handleNewMessage);
  }, [socket, dispatch]);

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat || !user) return;

    const payload = {
      chatId: activeChat._id,
      text: messageInput,
      senderId: user._id,
      senderName: user.firstName,
    };

    dispatch(sendMessageAction(payload));
    socket?.emit("send_message", payload);

    setMessageInput("");
  };

  // Filter out logged-in user from chat list
  const filteredChatUsers = user
    ? chatUsers.filter((u) => u._id !== user._id)
    : [];

  return (
    <Container fluid className="pt-2" style={{ height: "100vh" }}>
      <Row className="h-100">
        {/* LEFT: Users list */}
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
                  active={activeChat?._id === u._id}
                  onClick={() => setActiveChat(u)}
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

        {/* RIGHT: Chat Window */}
        <Col md={9} xs={12} className="d-flex flex-column">
          {activeChat ? (
            <>
              <div className="border-bottom p-2">
                <strong>
                  {activeChat.firstName} {activeChat.lastName}
                </strong>
              </div>

              <div
                ref={chatWindowRef}
                className="flex-grow-1 overflow-auto p-3"
                style={{ background: "#f8f9fa" }}
              >
                {messages.map((msg, idx) => {
                  const isMine = user && msg.senderId === user._id;
                  return (
                    <div
                      key={idx}
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
                        <div>{msg.text}</div>
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
