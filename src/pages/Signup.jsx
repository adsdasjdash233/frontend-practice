import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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

function Signup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("남성");
  const [residence, setResidence] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!id || !password || !name || !residence) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 기존 회원 목록 불러오기
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 중복 아이디 체크
    if (users.some(user => user.id === id)) {
      alert("이미 존재하는 아이디입니다.");
      return;
    }

    const newUser = { id, password, name, gender, residence };

    // 회원 목록에 추가 후 저장
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    alert("회원가입이 완료되었습니다!");
    navigate("/login");
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
        padding: "48px 16px",
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
          padding: "36px 32px",
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
          Everrent 회원가입
        </h2>
        <p style={{ fontSize: "13.5px", color: T.textMuted, margin: "0 0 26px 0", textAlign: "center" }}>
          캠퍼스 물품 대여 서비스의 회원이 되어보세요.
        </p>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>아이디</label>
            <input
              type="text"
              placeholder="사용할 아이디를 입력하세요"
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

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              {...focusRing}
              required
            />
          </div>

          {/* 네이티브 select 드롭다운 겹침 방지를 위한 선택 버튼 그룹 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>성별</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {["남성", "여성"].map((option) => {
                const isSelected = gender === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGender(option)}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = T.bg; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = T.cardBg; }}
                    style={{
                      padding: "11px 14px",
                      borderRadius: T.radiusSm,
                      border: isSelected ? `1px solid ${T.primary}` : `1px solid ${T.border}`,
                      backgroundColor: isSelected ? T.primarySoft : T.cardBg,
                      color: isSelected ? T.primaryDark : T.text,
                      fontSize: "14px",
                      fontWeight: isSelected ? "600" : "400",
                      cursor: "pointer",
                      fontFamily: T.font,
                      transition: "background-color 0.15s, border-color 0.15s",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>거주지역</label>
            <input
              type="text"
              placeholder="거주지역 (예: 대구 북구)"
              value={residence}
              onChange={(e) => setResidence(e.target.value)}
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
              fontFamily: T.font,
              transition: "background-color 0.15s",
            }}
          >
            가입하기
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
            <span>이미 계정이 있으신가요?</span>
            <Link to="/login" style={{ color: T.primary, textDecoration: "none", fontWeight: "600" }}>
              로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

Signup.displayName = "Signup";

export default Signup;