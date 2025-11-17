import { Button, ListGroup } from "react-bootstrap";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";

const UserList = ({
  directChats = [],
  groupChats = [],
  user,
  activeChat,
  openChatById,
  openChat,
  usersNotInChats = [],
  onCreateGroup,
  navigate,
  handleLogout,
}) => {
  const getInitials = (u) =>
    `${u?.firstName?.[0] || ""}${u?.lastName?.[0] || ""}`.toUpperCase();

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
            onClick={() => openChatById(c._id)}
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
    <>
      <div
        className="flex-grow-1 overflow-auto"
        style={{ minHeight: 0, padding: "0 0.5rem" }}
      >
        <div className="mb-3">
          <h6 className="text-white">Direct Chats</h6>
          {directChats.length ? (
            renderChatList(directChats)
          ) : (
            <div className="text-muted text-center py-2">No direct chats</div>
          )}
        </div>

        <div className="mb-3">
          <h6 className="text-white">Group Chats</h6>
          {groupChats.length ? (
            renderChatList(groupChats, true)
          ) : (
            <div className="text-light text-center py-2">No group chats</div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserList;
