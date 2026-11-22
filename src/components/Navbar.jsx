import { Link, useLocation } from 'react-router-dom';

function Navbar({ isLoggedIn }) {
  const { pathname } = useLocation();

  const getMenuStyle = (path) => ({
    textDecoration: "none",
    color: pathname === path ? "#00c73c" : "#666",
    fontWeight: pathname === path ? "bold" : "500"
  });

  return (
    <nav style={{ backgroundColor: "#fff", borderBottom: "1px solid #e1e2e3", fontFamily: "sans-serif", position: "sticky", top: 0, zIndex: 1000 }}>
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}>

        {/* 좌측 메인 로고 및 주요 메뉴 */}
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#00c73c", fontWeight: "bold", fontSize: "18px" }}>
            Everrent
          </Link>
          <div style={{ display: "flex", gap: "16px", fontSize: "14px" }}>
            <Link to="/" style={getMenuStyle("/")}>홈</Link>
            <Link to="/register" style={getMenuStyle("/register")}>물품등록</Link>
            <Link to="/rental" style={getMenuStyle("/rental")}>대여관리</Link>
          </div>
        </div>

        {/* 우측 인증 관련 메뉴 */}
        <div style={{ display: "flex", gap: "16px", fontSize: "14px", alignItems: "center" }}>
          {isLoggedIn ? (
            <Link
              to="/mypage"
              style={{
                textDecoration: "none",
                color: pathname === "/mypage" ? "#009e2f" : "#333",
                fontWeight: "bold",
                backgroundColor: pathname === "/mypage" ? "#e8fbf0" : "#f8f9fa",
                border: pathname === "/mypage" ? "1px solid #00c73c" : "1px solid #d0d5dd",
                padding: "6px 12px",
                borderRadius: "4px"
              }}
            >
              마이페이지
            </Link>
          ) : (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Link to="/login" style={{ textDecoration: "none", color: pathname === "/login" ? "#00c73c" : "#333", fontWeight: "500" }}>로그인</Link>
              <Link to="/signup" style={{ textDecoration: "none", color: "#00c73c", fontWeight: "bold" }}>회원가입</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

Navbar.displayName = "Navbar";

export default Navbar;