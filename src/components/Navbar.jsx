import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn }) {
  return (
    <nav style={{ backgroundColor: "#fff", borderBottom: "1px solid #e1e2e3", fontFamily: "sans-serif", position: "sticky", top: 0, zIndex: 1000 }}>
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}>
        
        {/* 좌측 메인 로고 및 주요 메뉴 */}
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#00c73c", fontWeight: "bold", fontSize: "18px" }}>
            Everrent
          </Link>
          <div style={{ display: "flex", gap: "16px", fontSize: "14px" }}>
            <Link to="/" style={{ textDecoration: "none", color: "#333", fontWeight: "500" }}>홈</Link>
            <Link to="/register" style={{ textDecoration: "none", color: "#666" }}>물품등록</Link>
            <Link to="/rental" style={{ textDecoration: "none", color: "#666" }}>대여관리</Link>
          </div>
        </div>

        {/* 우측 인증 관련 메뉴 */}
        <div style={{ display: "flex", gap: "16px", fontSize: "14px", alignItems: "center" }}>
          {isLoggedIn ? (
            <Link to="/mypage" style={{ textDecoration: "none", color: "#333", fontWeight: "500", backgroundColor: "#f1f3f5", padding: "6px 12px", borderRadius: "4px" }}>
              마이페이지
            </Link>
          ) : (
            <div style={{ display: "flex", gap: "12px" }}>
              <Link to="/login" style={{ textDecoration: "none", color: "#333", fontWeight: "500" }}>로그인</Link>
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