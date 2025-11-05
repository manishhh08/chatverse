import { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Form, Button, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../socketSetup/SocketContext";
import { getChatUsersAction } from "../features/users/userAction";
import {
  retrieveMessages,
  sendMessageAction,
} from "../features/messages/messageAction";

const ChatLayout = () => {
  const socket = useSocket();
  const dispatch = useDispatch();

  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  const chatWindowRef = useRef(null);

  // Redux
  const loggedInUser = useSelector((store) => store.userStore.user);
  const chatUsers = useSelector((store) => store.userStore.chatUsers);
  const messagesByChat = useSelector(
    (store) => store.message?.messagesByChat || {}
  );

  const messages = activeChat ? messagesByChat[activeChat._id] || [] : [];

  // fetch chat users on page load
  useEffect(() => {
    dispatch(getChatUsersAction());
  }, [dispatch]);

  // Load messages when chat selected
  useEffect(() => {
    if (activeChat) {
      dispatch(retrieveMessages(activeChat._id));
      socket?.emit("join_chat", activeChat._id);
    }
  }, [activeChat, dispatch, socket]);

  // Auto scroll
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Listen for new messages
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
    if (!messageInput.trim() || !activeChat) return;

    const payload = {
      chatId: activeChat._id,
      text: messageInput,
      senderId: loggedInUser._id,
      senderName: loggedInUser.firstName,
    };

    dispatch(sendMessageAction(payload));
    socket?.emit("send_message", payload);

    setMessageInput("");
  };

  return (
    <Container fluid className="pt-2" style={{ height: "100vh" }}>
      <Row className="h-100">
        {/* LEFT: Users list */}
        <Col md={3} className="border-end overflow-auto">
          <h5 className="py-2 border-bottom">Chats</h5>

          <ListGroup variant="flush">
            {chatUsers
              .filter((u) => u._id !== loggedInUser._id)
              .map((u) => (
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
                  const isMine = msg.senderId === loggedInUser._id;
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
