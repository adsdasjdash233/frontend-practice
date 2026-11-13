import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn }) {
  return (
    <nav style={{ padding: "15px 20px", borderBottom: "1px solid #ddd", display: "flex", gap: "15px", alignItems: "center" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Home</Link>
      <Link to="/register" style={{ textDecoration: "none", color: "#333" }}>물품등록</Link>
      
      {isLoggedIn ? (
        <Link to="/mypage" style={{ textDecoration: "none", color: "#333" }}>마이페이지</Link>
      ) : (
        <>
          <Link to="/login" style={{ textDecoration: "none", color: "#333" }}>로그인</Link>
          <Link to="/signup" style={{ textDecoration: "none", color: "#333" }}>회원가입</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;