import { Button } from "react-bootstrap";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

const ActionButtons = ({ onCreateGroup, navigate, handleLogout }) => {
  return (
    <div className="mt-auto d-flex flex-column gap-2 p-2 flex-shrink-0">
      <Button
        variant="primary"
        className="d-flex align-items-center justify-content-center gap-2 w-100"
        onClick={onCreateGroup}
      >
        ➕ Create Group
      </Button>
      <Button
        variant="outline-primary"
        className="d-flex align-items-center justify-content-center gap-2 w-100"
        onClick={() => navigate("/detail")}
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
  );
};

export default ActionButtons;
