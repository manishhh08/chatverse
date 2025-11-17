import { Accordion, ListGroup } from "react-bootstrap";

const NewUser = ({ usersNotInChats = [], openChat, searchTerm = "" }) => {
  const filteredUsers = usersNotInChats.filter((u) => {
    if (!searchTerm) return true;
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center text-light py-2">No users to start chat</div>
    );
  }

  return (
    <Accordion defaultActiveKey="0" flush>
      <Accordion.Item
        eventKey="0"
        disabled={filteredUsers.length === 0}
        className="bg-dark text-white border-0"
      >
        <Accordion.Header
          className="bg-dark text-white"
          style={{ backgroundColor: "#1a1a1a", color: "white" }}
        >
          Start New Chat
        </Accordion.Header>

        <Accordion.Body style={{ padding: 0, backgroundColor: "#1a1a1a" }}>
          <ListGroup variant="flush" className="bg-dark text-white">
            {filteredUsers.map((u) => (
              <ListGroup.Item
                key={u._id}
                action
                onClick={() => openChat(u._id)}
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
                  {u.firstName?.[0]?.toUpperCase()}
                  {u.lastName?.[0]?.toUpperCase()}
                </div>
                <strong>
                  {u.firstName} {u.lastName}
                </strong>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default NewUser;
