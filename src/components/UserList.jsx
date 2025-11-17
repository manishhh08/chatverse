import { ListGroup } from "react-bootstrap";
import { FiUsers } from "react-icons/fi";
import NewUser from "./NewUser";
import ActionButtons from "./ActionButtons";
import { useSelector } from "react-redux";

const UserList = ({
  user,
  activeChat,
  openChatById,
  openChat,
  usersNotInChats = [],
  onCreateGroup,
  navigate,
  handleLogout,
  searchTerm = "",
}) => {
  const { chats } = useSelector((store) => store.chatStore);

  const getInitials = (u) =>
    `${u?.firstName?.[0] || ""}${u?.lastName?.[0] || ""}`.toUpperCase();

  const directChats = chats.filter((c) => !c.isGroup);
  const groupChats = chats.filter((c) => c.isGroup);
  // Filter chats based on searchTerm
  const filteredDirectChats = directChats.filter((c) => {
    if (!searchTerm) return true;
    const otherUser = c.members.find((m) => m._id !== user._id);
    const fullName = `${otherUser?.firstName || ""} ${
      otherUser?.lastName || ""
    }`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredGroupChats = groupChats.filter((c) => {
    if (!searchTerm) return true;
    return c.name?.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div
      className="d-flex flex-column flex-grow-1"
      style={{ minHeight: 0, overflow: "hidden" }}
    >
      {/* Scrollable content */}
      <div
        className="flex-grow-1 overflow-auto"
        style={{ padding: "0 0.5rem" }}
      >
        {/* Direct Chats */}
        <div className="mb-3">
          <h6 className="text-white">Direct Chats</h6>
          {filteredDirectChats.length ? (
            renderChatList(filteredDirectChats)
          ) : (
            <div className="text-muted text-center py-2">No direct chats</div>
          )}
        </div>

        {/* Group Chats */}
        <div className="mb-3">
          <h6 className="text-white">Group Chats</h6>
          {filteredGroupChats.length ? (
            renderChatList(filteredGroupChats, true)
          ) : (
            <div className="text-light text-center py-2">No group chats</div>
          )}
        </div>

        {/* New Users */}
        <div className="mb-3">
          <NewUser
            usersNotInChats={usersNotInChats}
            openChat={openChat}
            searchTerm={searchTerm}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <ActionButtons
        onCreateGroup={onCreateGroup}
        navigate={navigate}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default UserList;
