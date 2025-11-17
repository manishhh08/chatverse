import { useEffect, useRef } from "react";
import { FiMessageSquare, FiSend } from "react-icons/fi";

const ChatWindow = ({
  activeChat,
  messages = [],
  user,
  typingUsers = [],
  chatWindowRef,
}) => {
  const localRef = useRef(null);
  const ref = chatWindowRef || localRef;

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages, ref]);

  return (
    <>
      {activeChat ? (
        <>
          <div className="border-bottom p-2 flex-shrink-0 bg-dark text-white d-flex justify-content-between align-items-center">
            <div>
              {activeChat.isGroup ? (
                <strong>
                  Group Chat:{" "}
                  {activeChat.name?.charAt(0).toUpperCase() +
                    (activeChat.name?.slice(1) || "")}
                </strong>
              ) : (
                (() => {
                  const otherUser = activeChat.members.find(
                    (m) => m._id !== user._id
                  );
                  const firstName =
                    otherUser?.firstName?.charAt(0).toUpperCase() +
                    (otherUser?.firstName?.slice(1) || "");
                  const lastName =
                    otherUser?.lastName?.charAt(0).toUpperCase() +
                    (otherUser?.lastName?.slice(1) || "");
                  return (
                    <strong>
                      Chat with {firstName} {lastName}
                    </strong>
                  );
                })()
              )}
            </div>

            {activeChat.isGroup && (
              <div
                className="d-flex align-items-center gap-1 flex-wrap"
                style={{ maxWidth: "50%" }}
              >
                {activeChat.members.map((member) => (
                  <div
                    key={member._id}
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                    style={{
                      width: "30px",
                      height: "30px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {member.firstName?.[0]?.toUpperCase()}
                    {member.lastName?.[0]?.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            ref={ref}
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
                      isMine ? "justify-content-end" : "justify-content-start"
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
                <FiMessageSquare size={60} className="mb-3 text-secondary" />
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
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center h-100 text-muted">
          Select a chat to start messaging
        </div>
      )}
    </>
  );
};

export default ChatWindow;
