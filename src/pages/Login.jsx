import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWindowWidth } from "../hooks/useWindowWidth";

/* ===== 디자인 토큰: pages 안의 모든 파일 상단에 동일하게 들어가는 블록 (외부 파일 불필요) ===== */
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
  success: "#16a34a",
  successLight: "#dcfce7",
  warning: "#d97706",
  warningLight: "#fef3c7",
  danger: "#dc2626",
  dangerLight: "#fee2e2",
  info: "#2563eb",
  infoLight: "#dbeafe",
  purple: "#7c3aed",
  purpleLight: "#ede9fe",
  shadow: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
  shadowHover: "0 8px 24px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.05)",
  shadowModal: "0 20px 50px rgba(15,23,42,0.25)",
  radius: "12px",
  radiusSm: "8px",
  radiusXs: "6px",
  font: "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const hoverBg = (base, hover) => ({
  onMouseEnter: (e) => { e.currentTarget.style.backgroundColor = hover; },
  onMouseLeave: (e) => { e.currentTarget.style.backgroundColor = base; },
});

const focusRing = {
  onFocus: (e) => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.15)"; },
  onBlur: (e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; },
};

function Login({ setIsLoggedIn }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isMobile } = useWindowWidth();

  const handleLogin = (e) => {
    e.preventDefault();

    const trimmedId = id.trim();
    if (!trimmedId || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    // 가입된 전체 회원 목록 조회
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.length === 0) {
      alert("등록된 회원 정보가 없습니다. 먼저 회원가입을 해주세요.");
      return;
    }

    // 1. 아이디 존재 여부 확인
    const foundUser = users.find((user) => user.id === trimmedId);

    if (!foundUser) {
      alert("존재하지 않는 아이디입니다.");
      return;
    }

    // 2. 아이디는 존재하지만 비밀번호가 틀린 경우
    if (foundUser.password !== password) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 3. 로그인 성공
    alert("로그인 성공!");
    if (typeof setIsLoggedIn === "function") {
      setIsLoggedIn(true);
    }
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", foundUser.id);

    // 홈으로 이동
    navigate("/");
  };

  const inputStyle = {
    padding: "12px 14px",
    border: `1px solid ${T.border}`,
    borderRadius: T.radiusSm,
    fontSize: "14px",
    color: T.text,
    backgroundColor: T.cardBg,
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
    fontFamily: T.font,
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const labelStyle = { fontSize: "12.5px", fontWeight: "600", color: T.text };

  return (
    <div
      style={{
        backgroundColor: T.bg,
        minHeight: "calc(100vh - 53px)",
        padding: isMobile ? "32px 14px" : "64px 20px",
        fontFamily: T.font,
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: T.cardBg,
          padding: isMobile ? "28px 20px" : "36px 32px",
          borderRadius: T.radius,
          border: `1px solid ${T.border}`,
          boxShadow: T.shadow,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            margin: "0 auto 14px",
            borderRadius: "12px",
            backgroundColor: T.primarySoft,
            border: `1px solid ${T.primaryBorder}`,
            color: T.primaryDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "20px",
          }}
        >
          E
        </div>

        <h2 style={{ fontSize: "20px", fontWeight: "700", color: T.text, margin: "0 0 6px 0", textAlign: "center", letterSpacing: "-0.01em" }}>
          Everrent 로그인
        </h2>
        <p style={{ fontSize: "13.5px", color: T.textMuted, margin: "0 0 26px 0", textAlign: "center" }}>
          캠퍼스 물품 대여 서비스에 로그인하세요.
        </p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>아이디</label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
              style={inputStyle}
              {...focusRing}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              {...focusRing}
              required
            />
          </div>

          <button
            type="submit"
            {...hoverBg(T.primary, T.primaryDark)}
            style={{
              width: "100%",
              padding: "13px",
              backgroundColor: T.primary,
              color: "#fff",
              border: "none",
              borderRadius: T.radiusSm,
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              marginTop: "6px",
              transition: "background-color 0.15s",
            }}
          >
            로그인
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
              paddingTop: "18px",
              borderTop: `1px solid ${T.border}`,
              fontSize: "13px",
              color: T.textMuted,
            }}
          >
            <span>계정이 없으신가요?</span>
            <Link to="/signup" style={{ color: T.primary, textDecoration: "none", fontWeight: "600" }}>
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

Login.displayName = "Login";

export default Login;
