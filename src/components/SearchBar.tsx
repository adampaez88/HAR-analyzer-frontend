type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<
    React.SetStateAction<string>
  >;
};

function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  const cardStyle = {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 0 0 1px #334155",
    marginTop: "25px",
  };

  return (
    <div style={cardStyle}>
      <input
        type="text"
        placeholder="Search endpoints..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        style={{
          width: "95%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #334155",
          background: "#0f172a",
          color: "white",
        }}
      />
    </div>
  );
}

export default SearchBar;