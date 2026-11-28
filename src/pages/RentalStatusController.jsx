import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateUtils";
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

/* 상태별 라벨 · 배지 색상 */
const STATUS_META = {
  AVAILABLE: { label: "대여 가능", color: T.success, bg: T.successLight },
  REQUESTED: { label: "예약중", color: T.warning, bg: T.warningLight },
  APPROVED: { label: "대여 승인됨", color: T.info, bg: T.infoLight },
  RENTED: { label: "대여 중", color: T.primaryDark, bg: T.primaryLight },
  RETURN_REQUESTED: { label: "반납 신청됨", color: T.warning, bg: T.warningLight },
  RETURNED: { label: "반납 완료", color: T.purple, bg: T.purpleLight },
};

function RentalStatusController() {
  const navigate = useNavigate();
  const { isMobile } = useWindowWidth();

  const currentUser = localStorage.getItem("currentUser");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    const savedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(savedItems);
  }, [isLoggedIn, currentUser, navigate]);

  const updateItemStatus = (itemId, nextStatus, renterName = undefined) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const now = new Date().toISOString();
        return {
          ...item,
          status: nextStatus,
          renter: renterName !== undefined ? renterName : item.renter,
          rentedAt: nextStatus === "RENTED" ? now : item.rentedAt,
          returnedAt: nextStatus === "RETURNED" ? now : item.returnedAt,
        };
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
  };

  const handleCancelOrReject = (itemId, isOwner) => {
    const actionName = isOwner ? "거절" : "취소";
    const reason = prompt(`${actionName} 사유를 입력해 주세요:`);
    if (reason === null) return;

    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          status: "AVAILABLE",
          renter: null,
          cancelReason: reason.trim() || `${actionName} 처리됨`,
        };
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
    alert(`대여 신청이 ${actionName}되었습니다.`);
  };

  /* ---------- 공용 스타일 ---------- */
  const cardStyle = {
    backgroundColor: T.cardBg,
    borderRadius: T.radius,
    border: `1px solid ${T.border}`,
    boxShadow: T.shadow,
    boxSizing: "border-box",
  };

  const primaryBtn = {
    padding: "9px 16px",
    backgroundColor: T.primary,
    color: "#fff",
    border: "none",
    borderRadius: T.radiusXs,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "background-color 0.15s",
  };

  const outlineBtn = {
    padding: "9px 14px",
    backgroundColor: T.cardBg,
    color: T.text,
    border: `1px solid ${T.border}`,
    borderRadius: T.radiusXs,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "background-color 0.15s",
  };

  const dangerOutlineBtn = {
    ...outlineBtn,
    color: T.danger,
    borderColor: T.dangerLight,
  };

  const hintText = { fontSize: "13px", color: T.textMuted };

  const myRelatedItems = items.filter(
    (item) => item.owner === currentUser || item.renter === currentUser
  );

  /* "(나)" 표시용 작은 태그 */
  const meTag = (
    <span
      style={{
        fontSize: "11px",
        fontWeight: "600",
        color: T.primaryDark,
        backgroundColor: T.primarySoft,
        border: `1px solid ${T.primaryBorder}`,
        padding: "1px 6px",
        borderRadius: "999px",
        marginLeft: "4px",
      }}
    >
      나
    </span>
  );

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
        {/* ===== 상단 헤더 ===== */}
        <div
          style={{
            ...cardStyle,
            padding: isMobile ? "16px 18px" : "20px 24px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "10px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: T.text, margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
              내 대여/등록 관리
            </h2>
            <p style={{ fontSize: "13.5px", color: T.textMuted, margin: 0, lineHeight: "1.5" }}>
              등록한 물품의 예약 승인 및 대여 중인 물품의 반납 상태를 관리합니다.
            </p>
          </div>
          <span
            style={{
              fontSize: "13px",
              backgroundColor: T.bg,
              color: T.textMuted,
              padding: "6px 12px",
              borderRadius: "999px",
              border: `1px solid ${T.border}`,
              flexShrink: 0,
            }}
          >
            접속 계정 <strong style={{ color: T.text, marginLeft: "4px" }}>{currentUser}</strong>
          </span>
        </div>

        {/* ===== 물품 상태 리스트 ===== */}
        {myRelatedItems.length === 0 ? (
          <div
            style={{
              ...cardStyle,
              padding: "64px 20px",
              textAlign: "center",
              color: T.textMuted,
              fontSize: "14px",
            }}
          >
            관련된 대여 내역이나 등록한 물품이 없습니다.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {myRelatedItems.map((item) => {
              const isOwner = item.owner === currentUser;
              const isRenter = item.renter === currentUser;
              const meta = STATUS_META[item.status] || { label: item.status, color: T.textMuted, bg: T.surface };

              return (
                <div
                  key={item.id}
                  style={{
                    ...cardStyle,
                    padding: isMobile ? "16px" : "20px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {/* 제목 + 상태 배지 */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: T.textMuted,
                          backgroundColor: T.surface,
                          padding: "3px 9px",
                          borderRadius: "999px",
                          fontWeight: "500",
                          flexShrink: 0,
                        }}
                      >
                        {item.category}
                      </span>
                      <strong
                        style={{
                          fontSize: "16px",
                          color: T.text,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.title}
                      </strong>
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: meta.color,
                        backgroundColor: meta.bg,
                        padding: "4px 10px",
                        borderRadius: "999px",
                        flexShrink: 0,
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {/* 상세 정보 */}
                  <div style={{ fontSize: "13.5px", color: T.textMuted, lineHeight: "1.7" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "20px", rowGap: "2px" }}>
                      <span>
                        1일 대여료{" "}
                        <strong style={{ color: T.text }}>{Number(item.pricePerDay).toLocaleString()}원</strong>
                      </span>
                      <span>
                        소유자 <strong style={{ color: T.text }}>{item.owner}</strong>
                        {isOwner && meTag}
                      </span>
                      <span>
                        대여자 <strong style={{ color: T.text }}>{item.renter || "없음"}</strong>
                        {isRenter && meTag}
                      </span>
                    </div>

                    {item.description && <p style={{ margin: "8px 0 0 0", color: T.textMuted }}>{item.description}</p>}

                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "12px",
                        color: T.textLight,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4px 16px",
                        borderTop: `1px solid ${T.border}`,
                        paddingTop: "10px",
                      }}
                    >
                      <span>등록일시 {formatDate(item.createdAt)}</span>
                      {item.rentedAt && <span>대여시작 {formatDate(item.rentedAt)}</span>}
                      {item.returnedAt && <span>반납완료 {formatDate(item.returnedAt)}</span>}
                    </div>
                  </div>

                  {/* 상태별 액션 */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                    {item.status === "REQUESTED" && isOwner && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateItemStatus(item.id, "APPROVED")}
                          style={primaryBtn}
                          {...hoverBg(T.primary, T.primaryDark)}
                        >
                          대여 승인하기 ({item.renter}님 예약)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelOrReject(item.id, true)}
                          style={dangerOutlineBtn}
                          {...hoverBg(T.cardBg, T.dangerLight)}
                        >
                          예약 거절
                        </button>
                      </>
                    )}
                    {item.status === "REQUESTED" && isRenter && (
                      <>
                        <span style={{ ...hintText, color: T.warning, fontWeight: "500" }}>
                          소유자({item.owner})의 예약 승인을 기다리는 중입니다.
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCancelOrReject(item.id, false)}
                          style={outlineBtn}
                          {...hoverBg(T.cardBg, T.bg)}
                        >
                          신청 취소
                        </button>
                      </>
                    )}

                    {item.status === "APPROVED" && (isOwner || isRenter) && (
                      <button
                        type="button"
                        onClick={() => updateItemStatus(item.id, "RENTED")}
                        style={primaryBtn}
                        {...hoverBg(T.primary, T.primaryDark)}
                      >
                        물품 수령 및 대여 시작
                      </button>
                    )}

                    {item.status === "RENTED" && isRenter && (
                      <button
                        type="button"
                        onClick={() => updateItemStatus(item.id, "RETURN_REQUESTED")}
                        style={primaryBtn}
                        {...hoverBg(T.primary, T.primaryDark)}
                      >
                        반납 신청하기
                      </button>
                    )}
                    {item.status === "RENTED" && isOwner && (
                      <span style={hintText}>{item.renter}님이 물품을 대여 중입니다.</span>
                    )}

                    {item.status === "RETURN_REQUESTED" && isOwner && (
                      <button
                        type="button"
                        onClick={() => updateItemStatus(item.id, "RETURNED")}
                        style={primaryBtn}
                        {...hoverBg(T.primary, T.primaryDark)}
                      >
                        반납 확인 및 완료 처리
                      </button>
                    )}
                    {item.status === "RETURN_REQUESTED" && isRenter && (
                      <span style={hintText}>소유자({item.owner})의 반납 확인을 기다리는 중입니다.</span>
                    )}

                    {item.status === "RETURNED" && (
                      <>
                        <span style={{ ...hintText, color: T.success, fontWeight: "500" }}>
                          대여 및 반납이 완료된 거래입니다.
                        </span>
                        {isOwner && (
                          <button
                            type="button"
                            onClick={() => updateItemStatus(item.id, "AVAILABLE", null)}
                            style={outlineBtn}
                            {...hoverBg(T.cardBg, T.bg)}
                          >
                            다시 대여 가능으로 전환
                          </button>
                        )}
                      </>
                    )}

                    {item.status === "AVAILABLE" && isOwner && (
                      <span style={hintText}>홈 화면에 공개되어 대여 신청을 기다리는 중입니다.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

RentalStatusController.displayName = "RentalStatusController";

export default RentalStatusController;