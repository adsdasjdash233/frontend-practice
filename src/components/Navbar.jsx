import { Link, useLocation } from "react-router-dom";
import { useWindowWidth } from "../hooks/useWindowWidth";

/* ===== 디자인 토큰: pages 파일들과 동일한 값 (외부 파일 불필요) ===== */
const T = {
  primary: "#0d9488",
  primaryDark: "#0f766e",
  primaryLight: "#ccfbf1",
  primarySoft: "#f0fdfa",
  primaryBorder: "#99f6e4",
  bg: "#f8fafc",
  surface: "#f1f5f9",
  cardBg: "#ffffff",
  text: "#1e293b",
  textMuted: "#64748b",
  textLight: "#94a3b8",
  border: "#e2e8f0",
  borderStrong: "#cbd5e1",
  radiusSm: "8px",
  radiusXs: "6px",
  font: "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

function Navbar({ isLoggedIn }) {
  const { pathname } = useLocation();
  const { isMobile } = useWindowWidth();

  /* 메뉴 링크: 현재 페이지는 틸 색 + 옅은 배경, 나머지는 hover 시 배경만 살짝 */
  const getMenuStyle = (path) => {
    const isActive = pathname === path;
    return {
      textDecoration: "none",
      color: isActive ? T.primaryDark : T.textMuted,
      backgroundColor: isActive ? T.primarySoft : "transparent",
      fontWeight: isActive ? "600" : "500",
      fontSize: isMobile ? "13px" : "14px",
      padding: isMobile ? "5px 8px" : "6px 12px",
      borderRadius: T.radiusXs,
      transition: "background-color 0.15s, color 0.15s",
    };
  };

  const menuHover = (path) => ({
    onMouseEnter: (e) => {
      if (pathname !== path) {
        e.currentTarget.style.backgroundColor = T.surface;
        e.currentTarget.style.color = T.text;
      }
    },
    onMouseLeave: (e) => {
      if (pathname !== path) {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = T.textMuted;
      }
    },
  });

  const isMyPage = pathname === "/mypage";

  return (
    <nav
      style={{
        backgroundColor: T.cardBg,
        borderBottom: `1px solid ${T.border}`,
        fontFamily: T.font,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1160px",
          margin: "0 auto",
          minHeight: isMobile ? "auto" : "52px",
          padding: isMobile ? "8px 14px" : "0 20px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: isMobile ? "6px 12px" : "16px",
          boxSizing: "border-box",
        }}
      >
        {/* 좌측 메인 로고 및 주요 메뉴 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? "10px" : "20px", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: T.text,
              fontWeight: "700",
              fontSize: isMobile ? "16px" : "18px",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "7px",
                backgroundColor: T.primary,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              E
            </span>
            Everrent
          </Link>
          <div style={{ display: "flex", gap: isMobile ? "2px" : "4px", alignItems: "center" }}>
            <Link to="/" style={getMenuStyle("/")} {...menuHover("/")}>홈</Link>
            <Link to="/register" style={getMenuStyle("/register")} {...menuHover("/register")}>물품등록</Link>
            <Link to="/rental" style={getMenuStyle("/rental")} {...menuHover("/rental")}>대여관리</Link>
          </div>
        </div>

        {/* 우측 인증 관련 메뉴 */}
        <div style={{ display: "flex", gap: "8px", fontSize: isMobile ? "13px" : "14px", alignItems: "center" }}>
          {isLoggedIn ? (
            <Link
              to="/mypage"
              onMouseEnter={(e) => { if (!isMyPage) e.currentTarget.style.backgroundColor = T.surface; }}
              onMouseLeave={(e) => { if (!isMyPage) e.currentTarget.style.backgroundColor = T.cardBg; }}
              style={{
                textDecoration: "none",
                color: isMyPage ? T.primaryDark : T.text,
                fontWeight: "600",
                backgroundColor: isMyPage ? T.primarySoft : T.cardBg,
                border: isMyPage ? `1px solid ${T.primaryBorder}` : `1px solid ${T.border}`,
                padding: isMobile ? "5px 10px" : "6px 14px",
                borderRadius: T.radiusSm,
                transition: "background-color 0.15s",
              }}
            >
              마이페이지
            </Link>
          ) : (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Link
                to="/login"
                {...menuHover("/login")}
                style={{ ...getMenuStyle("/login"), color: pathname === "/login" ? T.primaryDark : T.text }}
              >
                로그인
              </Link>
              <Link
                to="/signup"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.primaryDark; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = T.primary; }}
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  fontWeight: "600",
                  backgroundColor: T.primary,
                  padding: isMobile ? "5px 10px" : "6px 14px",
                  borderRadius: T.radiusSm,
                  transition: "background-color 0.15s",
                }}
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

Navbar.displayName = "Navbar";

export default Navbar;