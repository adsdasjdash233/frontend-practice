import { Link } from "react-router-dom";

function Navbar({ isLoggedIn }) {
  return (
    <nav style={{ padding: "15px", backgroundColor: "#f0f0f0", display: "flex", gap: "20px" }}>
      <Link to="/" style={{ textDecoration: "none", fontWeight: "bold", color: "#333" }}>Home</Link>
      {/* 로그인 여부에 따른 렌더링 분기 */}
      {!isLoggedIn ? (
        <>
          <Link to="/login" style={{ textDecoration: "none", fontWeight: "bold", color: "#333" }}>로그인</Link>
          <Link to="/signup" style={{ textDecoration: "none", fontWeight: "bold", color: "#333" }}>회원가입</Link>
        </>
      ) : (
        <Link to="/mypage" style={{ textDecoration: "none", fontWeight: "bold", color: "#333" }}>마이페이지</Link>
      )}
    </nav>
  );
}

export default Navbar;