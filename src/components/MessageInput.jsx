import { Form, Button } from "react-bootstrap";
import { FaSmile } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  isTyping,
  setIsTyping,
  socket,
  activeChat,
  user,
  typingTimeoutRef,
}) => {
  const onChange = (value) => {
    setMessageInput(value);

    if (!isTyping && activeChat && socket) {
      setIsTyping(true);
      socket.emit("typing", { chatId: activeChat._id, userId: user._id });
    }

    if (typingTimeoutRef) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        if (activeChat && socket) {
          socket.emit("stop_typing", {
            chatId: activeChat._id,
            userId: user._id,
          });
        }
      }, 2000);
    }
  };

  return (
    <>
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

      <div
        className="d-flex p-3 border-top flex-shrink-0"
        style={{ position: "relative" }}
      >
        <Form.Control
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => onChange(e.target.value)}
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

        <Button
          variant="outline-secondary"
          className="me-2"
          onClick={() => setShowEmojiPicker((p) => !p)}
        >
          <FaSmile size={18} />
        </Button>

        <Button onClick={handleSendMessage}>
          <FiSend />
        </Button>
      </div>
    </>
  );
};

export default MessageInput;
