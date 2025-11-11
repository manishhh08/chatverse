import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createChatApi } from "../features/chats/chatApi";
import { addChat } from "../features/chats/chatSlice";
import { useDispatch } from "react-redux";

const GroupChat = ({ show, onClose, users, currentUser }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (loading) return; // stop if already creating

    if (!groupName.trim()) return alert("Enter group name.");
    if (selectedMembers.length < 2)
      return alert("Select at least 2 users to form a group.");

    setLoading(true);

    try {
      const res = await createChatApi(
        [...selectedMembers, currentUser._id],
        true,
        groupName
      );

      if (res?.status === "success") {
        dispatch(addChat(res.chat));
        onClose();
        setSelectedMembers([]);
        setGroupName("");
      }
    } catch (err) {
      alert(err.message || "Failed to create group");
    } finally {
      setLoading(false); // ensures loading resets even on error
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Group Chat</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Project Team"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </Form.Group>

        <p className="mb-2">Select Members:</p>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {users.map((u) => (
            <Form.Check
              key={u._id}
              type="checkbox"
              label={`${u.firstName} ${u.lastName}`}
              checked={selectedMembers.includes(u._id)}
              onChange={() => toggleMember(u._id)}
            />
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" disabled={loading} onClick={handleCreate}>
          {loading ? "Creating..." : "Create Group"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GroupChat;
