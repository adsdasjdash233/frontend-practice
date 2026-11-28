import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

function MyPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useWindowWidth();
  const isCompact = isMobile || isTablet;

  const currentUser = localStorage.getItem("currentUser");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const [userInfo, setUserInfo] = useState({
    id: "",
    password: "",
    name: "",
    gender: "남성",
    residence: "",
  });

  const [authPassword, setAuthPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    password: "",
    name: "",
    gender: "남성",
    residence: "",
  });

  const [myItemsCount, setMyItemsCount] = useState(0);
  const [myRentalCount, setMyRentalCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((user) => user.id === currentUser);

    if (foundUser) {
      setUserInfo(foundUser);
      setEditForm({ ...foundUser, password: "" });
    }

    const allItems = JSON.parse(localStorage.getItem("items")) || [];
    setMyItemsCount(allItems.filter((item) => item.owner === currentUser).length);
    setMyRentalCount(allItems.filter((item) => item.renter === currentUser && item.status !== "AVAILABLE").length);
  }, [isLoggedIn, currentUser, navigate]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (authPassword === userInfo.password) {
      setIsUnlocked(true);
      setIsEditing(true);
      setEditForm({ ...userInfo, password: "" });
      alert("인증되었습니다. 회원 정보를 수정할 수 있습니다.");
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...userInfo,
      password: editForm.password || userInfo.password,
      name: editForm.name.trim(),
      gender: editForm.gender,
      residence: editForm.residence.trim(),
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((user) => (user.id === currentUser ? updatedUser : user));

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUserInfo(updatedUser);
    setIsEditing(false);
    setIsUnlocked(false);
    setAuthPassword("");
    alert("회원 정보가 성공적으로 수정되었습니다.");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    if (setIsLoggedIn) setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  /* ---------- 공용 스타일 ---------- */
  const cardStyle = {
    backgroundColor: T.cardBg,
    padding: isMobile ? "18px" : "24px",
    borderRadius: T.radius,
    border: `1px solid ${T.border}`,
    boxShadow: T.shadow,
    boxSizing: "border-box",
  };

  const inputStyle = {
    padding: "11px 13px",
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
  const fieldWrap = { display: "flex", flexDirection: "column", gap: "6px" };

  const primaryBtn = {
    padding: "12px",
    backgroundColor: T.primary,
    color: "#fff",
    border: "none",
    borderRadius: T.radiusSm,
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.15s",
  };

  const outlineBtn = {
    padding: "12px 16px",
    backgroundColor: T.cardBg,
    color: T.text,
    border: `1px solid ${T.border}`,
    borderRadius: T.radiusSm,
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.15s",
  };

  const cardTitle = { fontSize: "15px", fontWeight: "700", color: T.text, margin: "0 0 14px 0", letterSpacing: "-0.01em" };

  const infoRows = [
    ["아이디", userInfo.id],
    ["비밀번호", "••••••••"],
    ["이름", userInfo.name || "미입력"],
    ["성별", userInfo.gender || "미입력"],
    ["거주지역", userInfo.residence || "미입력"],
  ];

  return (
    <div
      style={{
        backgroundColor: T.bg,
        minHeight: "calc(100vh - 53px)",
        padding: isMobile ? "16px 0 32px 0" : "28px 0 44px 0",
        fontFamily: T.font,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1160px",
          margin: "0 auto",
          padding: isMobile ? "0 14px" : "0 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* 상단 헤더 영역 */}
        <div
          style={{
            ...cardStyle,
            padding: isMobile ? "16px 18px" : "20px 24px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "12px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: T.text, margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
              마이페이지
            </h2>
            <p style={{ fontSize: "13.5px", color: T.textMuted, margin: 0, lineHeight: "1.5" }}>
              회원 정보를 관리하고 나의 대여 활동 내역을 확인합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            {...hoverBg(T.cardBg, T.dangerLight)}
            style={{
              padding: "8px 16px",
              backgroundColor: T.cardBg,
              color: T.danger,
              border: `1px solid ${T.dangerLight}`,
              borderRadius: T.radiusXs,
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              alignSelf: isMobile ? "flex-end" : "auto",
              transition: "background-color 0.15s",
            }}
          >
            로그아웃
          </button>
        </div>

        {/* 메인 콘텐츠 레이아웃 */}
        <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : "1fr 1fr", gap: "16px", alignItems: "start" }}>
          {/* [좌측/상단] 기본 회원 정보 및 수정 영역 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {!isUnlocked ? (
              <div style={cardStyle}>
                <h3 style={{ ...cardTitle, margin: "0 0 6px 0" }}>회원 정보 보안 인증</h3>
                <p style={{ fontSize: "13px", color: T.textMuted, margin: "0 0 16px 0", lineHeight: "1.6" }}>
                  정보를 확인하거나 수정하려면 비밀번호를 한 번 더 입력해주세요.
                </p>
                <form onSubmit={handleUnlock} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    style={inputStyle}
                    {...focusRing}
                  />
                  <button type="submit" style={primaryBtn} {...hoverBg(T.primary, T.primaryDark)}>
                    비밀번호 확인
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ ...cardStyle, borderColor: T.primaryBorder }}>
                <div
                  style={{
                    fontSize: "13px",
                    color: T.primaryDark,
                    backgroundColor: T.primarySoft,
                    border: `1px solid ${T.primaryBorder}`,
                    borderRadius: T.radiusSm,
                    padding: "10px 12px",
                    margin: "0 0 18px 0",
                    fontWeight: "500",
                  }}
                >
                  본인 확인이 완료되었습니다. 정보를 수정할 수 있습니다.
                </div>

                <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>아이디 (변경 불가)</label>
                    <input
                      type="text"
                      value={userInfo.id}
                      disabled
                      style={{ ...inputStyle, backgroundColor: T.surface, color: T.textMuted, cursor: "not-allowed" }}
                    />
                  </div>

                  <div style={fieldWrap}>
                    <label style={labelStyle}>새 비밀번호</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="변경할 비밀번호 (미입력시 유지)"
                      value={editForm.password}
                      onChange={handleChange}
                      style={inputStyle}
                      {...focusRing}
                    />
                  </div>

                  <div style={fieldWrap}>
                    <label style={labelStyle}>이름</label>
                    <input type="text" name="name" value={editForm.name} onChange={handleChange} style={inputStyle} {...focusRing} />
                  </div>

                  <div style={fieldWrap}>
                    <label style={labelStyle}>성별</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {["남성", "여성"].map((option) => {
                        const isSelected = editForm.gender === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setEditForm((prev) => ({ ...prev, gender: option }))}
                            style={{
                              padding: "10px 12px",
                              borderRadius: T.radiusSm,
                              border: `1px solid ${isSelected ? T.primary : T.border}`,
                              backgroundColor: isSelected ? T.primarySoft : T.cardBg,
                              color: isSelected ? T.primaryDark : T.textMuted,
                              fontSize: "13.5px",
                              fontWeight: isSelected ? "600" : "500",
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={fieldWrap}>
                    <label style={labelStyle}>거주지역</label>
                    <input type="text" name="residence" value={editForm.residence} onChange={handleChange} style={inputStyle} {...focusRing} />
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    <button type="submit" style={{ ...primaryBtn, flex: 1 }} {...hoverBg(T.primary, T.primaryDark)}>
                      저장하기
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUnlocked(false);
                        setIsEditing(false);
                      }}
                      style={outlineBtn}
                      {...hoverBg(T.cardBg, T.bg)}
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!isEditing && (
              <div style={cardStyle}>
                <h3 style={{ ...cardTitle, margin: "0 0 6px 0" }}>기본 회원 정보</h3>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {infoRows.map(([label, value], idx) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom: idx === infoRows.length - 1 ? "none" : `1px solid ${T.border}`,
                        fontSize: "13.5px",
                      }}
                    >
                      <span style={{ color: T.textMuted }}>{label}</span>
                      <strong style={{ color: T.text, fontWeight: "600" }}>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* [우측/하단] 나의 활동 요약 및 바로가기 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={cardStyle}>
              <h3 style={cardTitle}>나의 대여 활동 요약</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: T.primarySoft,
                    border: `1px solid ${T.primaryBorder}`,
                    borderRadius: T.radiusSm,
                  }}
                >
                  <div style={{ fontSize: "12.5px", color: T.textMuted, marginBottom: "6px" }}>내가 등록한 물품</div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: T.primaryDark, letterSpacing: "-0.02em" }}>
                    {myItemsCount}
                    <span style={{ fontSize: "13px", fontWeight: "500", marginLeft: "2px" }}>건</span>
                  </div>
                </div>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: T.infoLight,
                    border: "1px solid #bfdbfe",
                    borderRadius: T.radiusSm,
                  }}
                >
                  <div style={{ fontSize: "12.5px", color: T.textMuted, marginBottom: "6px" }}>진행 중인 대여/신청</div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: T.info, letterSpacing: "-0.02em" }}>
                    {myRentalCount}
                    <span style={{ fontSize: "13px", fontWeight: "500", marginLeft: "2px" }}>건</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/rental")}
                {...hoverBg(T.cardBg, T.bg)}
                style={{ ...outlineBtn, width: "100%", marginTop: "16px", fontWeight: "600" }}
              >
                대여 관리 페이지로 이동하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MyPage.displayName = "MyPage";

export default MyPage;