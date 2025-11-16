const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredDirectChats = directChats.filter((c) => {
    if (!searchTerm) return true;
    const otherUser = c.members.find((m) => m._id !== user._id);
    return otherUser?.firstName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const filteredGroupChats = groupChats.filter((c) => {
    if (!searchTerm) return true;
    return c.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
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
