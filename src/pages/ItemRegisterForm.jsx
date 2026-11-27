import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const ITEM_CATEGORIES = ["전자기기", "서적/교재", "캠핑/레저", "생활용품", "기타"];

function ItemRegisterForm() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = localStorage.getItem("currentUser");

  // ERD 기준 물품(Item) 필드 구조에 맞춘 상태값 정의
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("전자기기");
  const [pricePerDay, setPricePerDay] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!title.trim() || !pricePerDay) {
      alert("물품 제목과 1일 대여료를 입력해주세요.");
      return;
    }

    // 기존 로컬 스토리지의 물품 리스트 불러오기
    const existingItems = JSON.parse(localStorage.getItem("items")) || [];

    // ERD 명세서에 맞춘 새로운 물품 객체 생성
    const newItem = {
      id: Date.now(), // 고유 식별자 (PK)
      title: title.trim(),
      category: category,
      pricePerDay: Number(pricePerDay),
      description: description.trim(),
      owner: currentUser, // 등록자 (FK / 회원 연동)
      status: "AVAILABLE", // 초기 상태: 대여 가능
      viewCount: 0, // ERD 조회수 기본값 반영
      createdAt: new Date().toISOString(), // 등록일시
    };

    // 리스트에 추가 후 저장
    const updatedItems = [newItem, ...existingItems];
    localStorage.setItem("items", JSON.stringify(updatedItems));

    alert("물품이 성공적으로 등록되었습니다!");
    navigate("/");
  };

  /* ---------- 공용 스타일 ---------- */
  const fieldStyle = {
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

  const labelStyle = { fontSize: "13px", fontWeight: "600", color: T.text };
  const fieldWrap = { display: "flex", flexDirection: "column", gap: "7px" };
  const required = <span style={{ color: T.danger, marginLeft: "3px" }}>*</span>;

  return (
    <div
      style={{
        backgroundColor: T.bg,
        minHeight: "calc(100vh - 53px)",
        padding: "36px 20px 48px",
        fontFamily: T.font,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          backgroundColor: T.cardBg,
          padding: "32px",
          borderRadius: T.radius,
          border: `1px solid ${T.border}`,
          boxShadow: T.shadow,
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: T.text, margin: "0 0 6px 0", letterSpacing: "-0.01em" }}>
          캠퍼스 물품 등록
        </h2>
        <p style={{ fontSize: "13.5px", color: T.textMuted, margin: "0 0 22px 0", lineHeight: "1.5" }}>
          대여 가능한 물품 정보를 정확하게 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* 등록자 정보 (읽기 전용) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              fontSize: "13px",
              color: T.textMuted,
              backgroundColor: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: T.radiusSm,
              padding: "11px 14px",
            }}
          >
            <span>등록자(소유자)</span>
            <strong style={{ color: T.text, fontWeight: "600" }}>{currentUser || "비회원"}</strong>
          </div>

          {/* 물품 제목 */}
          <div style={fieldWrap}>
            <label style={labelStyle}>
              물품 제목{required}
            </label>
            <input
              type="text"
              placeholder="예: 공학용 계산기 TI-nspire CX II"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={fieldStyle}
              {...focusRing}
              required
            />
          </div>

          {/* 1일 대여료 */}
          <div style={fieldWrap}>
            <label style={labelStyle}>
              1일 대여료{required}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="number"
                placeholder="숫자만 입력하세요 (예: 3000)"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                style={{ ...fieldStyle, paddingRight: "40px" }}
                {...focusRing}
                required
              />
              <span
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "13px",
                  color: T.textLight,
                  pointerEvents: "none",
                }}
              >
                원
              </span>
            </div>
          </div>

          {/* 카테고리 */}
          <div style={fieldWrap}>
            <label style={labelStyle}>카테고리</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {ITEM_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "999px",
                      border: `1px solid ${isSelected ? T.primary : T.border}`,
                      backgroundColor: isSelected ? T.primary : T.cardBg,
                      color: isSelected ? "#fff" : T.textMuted,
                      fontSize: "13px",
                      fontWeight: isSelected ? "600" : "500",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 물품 설명 */}
          <div style={fieldWrap}>
            <label style={labelStyle}>물품 상세 설명</label>
            <textarea
              placeholder="물품 상태, 거래 희망 장소, 주의사항 등을 상세히 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              style={{ ...fieldStyle, resize: "vertical", lineHeight: "1.6" }}
              {...focusRing}
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            {...hoverBg(T.primary, T.primaryDark)}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: T.primary,
              color: "#fff",
              border: "none",
              borderRadius: T.radiusSm,
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              marginTop: "4px",
              transition: "background-color 0.15s",
            }}
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
}

ItemRegisterForm.displayName = "ItemRegisterForm";

export default ItemRegisterForm;