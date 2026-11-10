import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "15px", backgroundColor: "#f0f0f0", display: "flex", gap: "20px" }}>
      <Link to="/" style={{ textDecoration: "none", fontWeight: "bold", color: "#333" }}>Home</Link>
      <Link to="/about" style={{ textDecoration: "none", fontWeight: "bold", color: "#333" }}>About</Link>
    </nav>
  );
}

export default Navbar;