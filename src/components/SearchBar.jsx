import { Form } from "react-bootstrap";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="p-2 flex-shrink-0">
      <Form.Control
        type="text"
        placeholder="Search chats..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-dark text-white border border-secondary chat-input"
        style={{ fontSize: "14px", minHeight: "40px" }}
      />
    </div>
  );
};

export default SearchBar;
