import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { formatDate } from "../utils/dateUtils";
import { useWindowWidth } from "../hooks/useWindowWidth";
import CategoryThumb from "../components/CategoryThumb";

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

const CATEGORIES = ["전체", "전자기기", "서적/교재", "캠핑/레저", "생활용품", "기타"];

function Home() {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useWindowWidth();
  const isCompact = isMobile || isTablet;

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = localStorage.getItem("currentUser");

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(savedItems);
  }, []);

  useEffect(() => {
    if (!selectedItem) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem]);

  const availableItems = items.filter((item) => item.status === "AVAILABLE");

  const displayedItems = availableItems.filter((item) => {
    const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
    const keyword = searchTerm.trim().toLowerCase();
    const matchesSearch =
      keyword === "" ||
      item.title.toLowerCase().includes(keyword) ||
      (item.description && item.description.toLowerCase().includes(keyword));

    return matchesCategory && matchesSearch;
  });

  const handleSelectItem = (item) => {
    const updatedItems = items.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          viewCount: (i.viewCount || 0) + 1,
        };
      }
      return i;
    });

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));

    const clickedItem = updatedItems.find((i) => i.id === item.id);
    setSelectedItem(clickedItem);
  };

  const handleRequestRental = (itemId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        if (item.owner === currentUser) {
          alert("본인이 등록한 물품은 본인이 대여할 수 없습니다.");
          return item;
        }
        return {
          ...item,
          status: "REQUESTED",
          renter: currentUser,
        };
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
    setSelectedItem(null);
    alert("대여 신청이 완료되었습니다.");
    navigate("/rental");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  /* ---------- 공용 스타일 ---------- */
  const cardStyle = {
    backgroundColor: T.cardBg,
    padding: isMobile ? "18px" : "22px",
    borderRadius: T.radius,
    border: `1px solid ${T.border}`,
    boxShadow: T.shadow,
    boxSizing: "border-box",
  };

  const primaryBtn = {
    width: "100%",
    padding: "11px",
    backgroundColor: T.primary,
    color: "#fff",
    border: "none",
    borderRadius: T.radiusSm,
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.15s",
  };

  const menuBtn = {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: T.cardBg,
    color: T.text,
    border: `1px solid ${T.border}`,
    borderRadius: T.radiusSm,
    fontSize: "13.5px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    transition: "background-color 0.15s",
  };

  const itemCardHover = {
    onMouseEnter: (e) => {
      e.currentTarget.style.boxShadow = T.shadowHover;
      e.currentTarget.style.borderColor = T.primaryBorder;
      e.currentTarget.style.transform = "translateY(-2px)";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.transform = "translateY(0)";
    },
  };

  const categoryTag = {
    fontSize: "11.5px",
    color: T.textMuted,
    backgroundColor: T.surface,
    padding: "3px 9px",
    borderRadius: "999px",
    fontWeight: "500",
  };

  return (
    <div
      style={{
        backgroundColor: T.bg,
        minHeight: "calc(100vh - 53px)",
        fontFamily: T.font,
        padding: isMobile ? "16px 0 32px 0" : "28px 0 44px 0",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1160px",
          margin: "0 auto",
          display: "flex",
          flexDirection: isCompact ? "column" : "row",
          alignItems: "flex-start",
          gap: isMobile ? "14px" : "20px",
          padding: isMobile ? "0 14px" : "0 20px",
          boxSizing: "border-box",
        }}
      >
        {/* [좌측/메인 영역] 검색 + 카테고리 필터 + 물품 리스트 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: 0, width: "100%" }}>
          <div style={cardStyle}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: T.text, margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
              캠퍼스 물품 대여
            </h2>
            <p style={{ fontSize: "13.5px", color: T.textMuted, margin: "0 0 16px 0", lineHeight: "1.5" }}>
              현재 대여 가능한 공개 물품을 검색하고 대여해 보세요.
            </p>

            <div style={{ position: "relative", marginBottom: "14px" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={T.textLight}
                strokeWidth="2"
                strokeLinecap="round"
                style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                type="text"
                placeholder="찾고 싶은 물품명을 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                {...focusRing}
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 38px",
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radiusSm,
                  fontSize: "14px",
                  color: T.text,
                  backgroundColor: T.bg,
                  boxSizing: "border-box",
                  outline: "none",
                  fontFamily: T.font,
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: isMobile ? "6px 12px" : "7px 14px",
                      borderRadius: "999px",
                      border: `1px solid ${isActive ? T.primary : T.border}`,
                      backgroundColor: isActive ? T.primary : T.cardBg,
                      color: isActive ? "#fff" : T.textMuted,
                      fontSize: "13px",
                      fontWeight: isActive ? "600" : "500",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", margin: 0, color: T.text, letterSpacing: "-0.01em" }}>
                {selectedCategory === "전체" && searchTerm.trim() === ""
                  ? "전체 대여 가능 물품"
                  : `${selectedCategory} 필터 결과`}
                <span style={{ marginLeft: "8px", color: T.primary, fontWeight: "600" }}>{displayedItems.length}건</span>
              </h3>
            </div>

            {displayedItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "56px 0", color: T.textMuted, fontSize: "14px" }}>
                {selectedCategory !== "전체" || searchTerm.trim() !== ""
                  ? "일치하는 검색 결과가 없습니다."
                  : "현재 대여 가능한 물품이 없습니다."}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                  gap: "14px",
                }}
              >
                {displayedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    {...itemCardHover}
                    style={{
                      padding: isMobile ? "16px" : "18px",
                      border: `1px solid ${T.border}`,
                      borderRadius: T.radius,
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      backgroundColor: T.cardBg,
                      cursor: "pointer",
                      transition: "box-shadow 0.2s, border-color 0.2s, transform 0.2s",
                    }}
                  >
                    <CategoryThumb category={item.category} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={categoryTag}>{item.category}</span>
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: T.primaryDark,
                          backgroundColor: T.primarySoft,
                          border: `1px solid ${T.primaryBorder}`,
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontWeight: "600",
                        }}
                      >
                        대여 가능
                      </span>
                    </div>

                    <div>
                      <h4 style={{ fontSize: "15.5px", fontWeight: "700", margin: "0 0 4px 0", color: T.text, letterSpacing: "-0.01em" }}>
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "13px",
                          color: T.textMuted,
                          lineHeight: "1.5",
                          margin: "0 0 10px 0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.description}
                      </p>

                      <div style={{ fontSize: "12px", color: T.textLight, display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                        <span>등록 {formatDate(item.createdAt)}</span>
                        <span>·</span>
                        <span>조회 {item.viewCount || 0}</span>
                      </div>

                      <div style={{ fontSize: "17px", fontWeight: "700", color: T.text, letterSpacing: "-0.01em" }}>
                        {Number(item.pricePerDay).toLocaleString()}
                        <span style={{ fontSize: "12.5px", fontWeight: "400", color: T.textMuted, marginLeft: "3px" }}>원 / 1일</span>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "8px",
                        borderTop: `1px solid ${T.border}`,
                        paddingTop: "12px",
                      }}
                    >
                      <span style={{ fontSize: "12.5px", color: T.textMuted }}>
                        등록자 <strong style={{ color: T.text, fontWeight: "600" }}>{item.owner}</strong>
                      </span>
                      {item.owner !== currentUser ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRequestRental(item.id);
                          }}
                          {...hoverBg(T.primary, T.primaryDark)}
                          style={{
                            padding: "7px 14px",
                            backgroundColor: T.primary,
                            color: "#fff",
                            border: "none",
                            borderRadius: T.radiusXs,
                            cursor: "pointer",
                            fontSize: "12.5px",
                            fontWeight: "600",
                            flexShrink: 0,
                            transition: "background-color 0.15s",
                          }}
                        >
                          대여 신청
                        </button>
                      ) : (
                        <span style={{ fontSize: "12px", color: T.textMuted, backgroundColor: T.surface, padding: "4px 10px", borderRadius: "999px", fontWeight: "500" }}>
                          내 물품
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* [우측/하단 영역] 로그인 / 내 정보 위젯 */}
        <div
          style={{
            width: isCompact ? "100%" : "300px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            flexShrink: 0,
            position: isCompact ? "static" : "sticky",
            top: "73px",
          }}
        >
          {!isLoggedIn ? (
            <div style={{ ...cardStyle, textAlign: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: T.text, margin: "0 0 6px 0", letterSpacing: "-0.01em" }}>
                Everrent 로그인
              </h3>
              <p style={{ fontSize: "13px", color: T.textMuted, margin: "0 0 18px 0" }}>서비스 이용을 위해 로그인해 주세요.</p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                style={{ ...primaryBtn, marginBottom: "12px" }}
                {...hoverBg(T.primary, T.primaryDark)}
              >
                로그인
              </button>
              <div style={{ display: "flex", justifyContent: "center", fontSize: "13px" }}>
                <Link to="/signup" style={{ color: T.textMuted, textDecoration: "none", fontWeight: "500" }}>
                  아직 계정이 없으신가요? <span style={{ color: T.primary, fontWeight: "600" }}>회원가입</span>
                </Link>
              </div>
            </div>
          ) : (
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                  borderBottom: `1px solid ${T.border}`,
                  paddingBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: T.primarySoft,
                    border: `1px solid ${T.primaryBorder}`,
                    color: T.primaryDark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  {currentUser ? currentUser.substring(0, 1).toUpperCase() : "U"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ fontSize: "15px", color: T.text }}>{currentUser}</strong>
                  <span style={{ fontSize: "13px", color: T.textMuted }}> 님</span>
                  <div style={{ fontSize: "12px", color: T.textLight, marginTop: "2px" }}>오늘도 필요한 물품을 찾아보세요</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button type="button" onClick={() => navigate("/mypage")} style={menuBtn} {...hoverBg(T.cardBg, T.bg)}>
                  <span>마이페이지</span>
                  <span style={{ color: T.textLight }}>›</span>
                </button>
                <button type="button" onClick={() => navigate("/register")} style={menuBtn} {...hoverBg(T.cardBg, T.bg)}>
                  <span>물품 등록</span>
                  <span style={{ color: T.textLight }}>›</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{ ...menuBtn, justifyContent: "center", color: T.danger, borderColor: T.dangerLight, marginTop: "4px" }}
                  {...hoverBg(T.cardBg, T.dangerLight)}
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}

          <div style={{ ...cardStyle, fontSize: "13px", color: T.textMuted, lineHeight: "1.7" }}>
            <strong style={{ color: T.text, display: "block", marginBottom: "8px", fontSize: "13.5px" }}>이용 안내</strong>
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
              <li>대여 가능한 물품만 표시됩니다.</li>
              <li>카테고리와 검색어로 원하는 물품을 좁혀볼 수 있습니다.</li>
              <li>물품 카드를 클릭하면 상세 내용과 조회수가 증가합니다.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 물품 상세 보기 모달 */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(2px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "16px",
            boxSizing: "border-box",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: T.cardBg,
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: isMobile ? "20px" : "26px",
              borderRadius: "14px",
              boxShadow: T.shadowModal,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              fontFamily: T.font,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={categoryTag}>{selectedItem.category}</span>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                {...hoverBg("transparent", T.surface)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "transparent",
                  border: "none",
                  fontSize: "15px",
                  cursor: "pointer",
                  color: T.textMuted,
                  transition: "background-color 0.15s",
                }}
              >
                ✕
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: "19px", fontWeight: "700", color: T.text, margin: "0 0 8px 0", letterSpacing: "-0.01em" }}>
                {selectedItem.title}
              </h3>
              <div style={{ fontSize: "12.5px", color: T.textLight, display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                <span>등록자 {selectedItem.owner}</span>
                <span>·</span>
                <span>등록일 {formatDate(selectedItem.createdAt)}</span>
                <span>·</span>
                <span>조회수 {selectedItem.viewCount}</span>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: T.text,
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                  backgroundColor: T.bg,
                  border: `1px solid ${T.border}`,
                  padding: "14px 16px",
                  borderRadius: T.radiusSm,
                  minHeight: "80px",
                  margin: "0 0 16px 0",
                  boxSizing: "border-box",
                }}
              >
                {selectedItem.description || "등록된 상세 설명이 없습니다."}
              </p>
              <div style={{ fontSize: "20px", fontWeight: "700", color: T.primaryDark, letterSpacing: "-0.01em" }}>
                {Number(selectedItem.pricePerDay).toLocaleString()}
                <span style={{ fontSize: "13px", fontWeight: "400", color: T.textMuted, marginLeft: "4px" }}>원 / 1일</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "8px", marginTop: "4px" }}>
              {selectedItem.owner !== currentUser ? (
                <button
                  type="button"
                  onClick={() => handleRequestRental(selectedItem.id)}
                  {...hoverBg(T.primary, T.primaryDark)}
                  style={{ ...primaryBtn, flex: 1, width: "auto" }}
                >
                  대여 신청하기
                </button>
              ) : (
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "11px",
                    backgroundColor: T.surface,
                    color: T.textMuted,
                    borderRadius: T.radiusSm,
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                >
                  내가 등록한 물품입니다.
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                {...hoverBg(T.cardBg, T.bg)}
                style={{
                  padding: "11px 18px",
                  backgroundColor: T.cardBg,
                  color: T.text,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radiusSm,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "background-color 0.15s",
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Home.displayName = "Home";

export default Home;