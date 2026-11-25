import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateUtils";
import { useWindowWidth } from "../hooks/useWindowWidth";

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

  const statusLabels = {
    AVAILABLE: "대여 가능",
    REQUESTED: "예약중",
    APPROVED: "대여 승인됨",
    RENTED: "대여 중",
    RETURN_REQUESTED: "반납 신청됨",
    RETURNED: "반납 완료",
  };

  const secondaryBtnStyle = {
    padding: "6px 12px",
    backgroundColor: "#fff",
    color: "#333",
    border: "1px solid #d0d5dd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  };

  const myRelatedItems = items.filter(
    (item) => item.owner === currentUser || item.renter === currentUser
  );

  return (
    <div style={{ backgroundColor: "#f4f5f7", minHeight: "calc(100vh - 53px)", padding: isMobile ? "16px 0 32px 0" : "24px 0 40px 0", fontFamily: "sans-serif", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 14px" : "0 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* 상단 헤더 카드 */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: isMobile ? "16px 18px" : "20px 24px",
            borderRadius: "8px",
            border: "1px solid #e1e2e3",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "10px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 4px 0" }}>내 대여/등록 관리</h2>
            <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>등록한 물품의 예약 승인 및 대여 중인 물품의 반납 상태를 관리합니다.</p>
          </div>
          <span style={{ fontSize: "13px", backgroundColor: "#f8f9fa", color: "#333", padding: "6px 12px", borderRadius: "4px", border: "1px solid #e1e2e3" }}>
            접속 계정: <strong>{currentUser}</strong>
          </span>
        </div>

        {/* 물품 상태 리스트 */}
        {myRelatedItems.length === 0 ? (
          <div style={{ backgroundColor: "#fff", padding: "60px 20px", borderRadius: "8px", border: "1px solid #e1e2e3", boxSizing: "border-box", textAlign: "center", color: "#888", fontSize: "14px" }}>
            관련된 대여 내역이나 등록한 물품이 없습니다.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {myRelatedItems.map((item) => {
              const isOwner = item.owner === currentUser;
              const isRenter = item.renter === currentUser;

              return (
                <div
                  key={item.id}
                  style={{
                    padding: isMobile ? "16px" : "20px 24px",
                    border: "1px solid #e1e2e3",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                      <span style={{ fontSize: "11px", color: "#666", backgroundColor: "#f1f3f5", padding: "2px 6px", borderRadius: "4px", flexShrink: 0 }}>
                        {item.category}
                      </span>
                      <strong style={{ fontSize: "16px", color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</strong>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: item.status === "AVAILABLE" ? "#00c73c" : "#2563eb", flexShrink: 0 }}>
                      {statusLabels[item.status] || item.status}
                    </span>
                  </div>

                  <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.6" }}>
                    <p style={{ margin: "2px 0" }}>1일 대여료: <strong style={{ color: "#333" }}>{Number(item.pricePerDay).toLocaleString()}원</strong></p>
                    <p style={{ margin: "2px 0" }}>
                      소유자: <strong style={{ color: "#333" }}>{item.owner}</strong> {isOwner && <span style={{ color: "#00c73c", fontWeight: "bold" }}>(나)</span>} |{" "}
                      대여자: <strong style={{ color: "#333" }}>{item.renter || "없음"}</strong> {isRenter && <span style={{ color: "#2563eb", fontWeight: "bold" }}>(나)</span>}
                    </p>
                    <p style={{ margin: "6px 0 0 0", color: "#666" }}>{item.description}</p>

                    <div style={{ marginTop: "8px", fontSize: "11px", color: "#888", display: "flex", flexWrap: "wrap", gap: "12px", borderTop: "1px dashed #e1e2e3", paddingTop: "6px" }}>
                      <span>등록일시: {formatDate(item.createdAt)}</span>
                      {item.rentedAt && <span>대여시작: {formatDate(item.rentedAt)}</span>}
                      {item.returnedAt && <span>반납완료: {formatDate(item.returnedAt)}</span>}
                    </div>
                  </div>

                  <div style={{ marginTop: "6px", paddingTop: "12px", borderTop: "1px solid #f1f3f5", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                    {item.status === "REQUESTED" && isOwner && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateItemStatus(item.id, "APPROVED")}
                          style={{ padding: "8px 14px", backgroundColor: "#00c73c", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
                        >
                          대여 승인하기 ({item.renter}님 예약)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelOrReject(item.id, true)}
                          style={{ padding: "8px 14px", backgroundColor: "#fff", color: "#d9534f", border: "1px solid #d9534f", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                        >
                          예약 거절
                        </button>
                      </>
                    )}
                    {item.status === "REQUESTED" && isRenter && (
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "13px", color: "#d97706", fontWeight: "bold" }}>소유자({item.owner})의 예약 승인을 기다리는 중입니다.</span>
                        <button
                          type="button"
                          onClick={() => handleCancelOrReject(item.id, false)}
                          style={{ ...secondaryBtnStyle, fontWeight: "normal", color: "#666" }}
                        >
                          신청 취소
                        </button>
                      </div>
                    )}

                    {item.status === "APPROVED" && (isOwner || isRenter) && (
                      <button
                        type="button"
                        onClick={() => updateItemStatus(item.id, "RENTED")}
                        style={{ padding: "8px 14px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
                      >
                        물품 수령 및 대여 시작
                      </button>
                    )}

                    {item.status === "RENTED" && isRenter && (
                      <button
                        type="button"
                        onClick={() => updateItemStatus(item.id, "RETURN_REQUESTED")}
                        style={{ padding: "8px 14px", backgroundColor: "#d97706", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
                      >
                        반납 신청하기
                      </button>
                    )}
                    {item.status === "RENTED" && isOwner && (
                      <span style={{ fontSize: "13px", color: "#666" }}>{item.renter}님이 물품을 대여 중입니다.</span>
                    )}

                    {item.status === "RETURN_REQUESTED" && isOwner && (
                      <button
                        type="button"
                        onClick={() => updateItemStatus(item.id, "RETURNED")}
                        style={{ padding: "8px 14px", backgroundColor: "#9333ea", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
                      >
                        반납 확인 및 완료 처리
                      </button>
                    )}
                    {item.status === "RETURN_REQUESTED" && isRenter && (
                      <span style={{ fontSize: "13px", color: "#666" }}>소유자({item.owner})의 반납 확인을 기다리는 중입니다.</span>
                    )}

                    {item.status === "RETURNED" && (
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "bold", color: "#16a34a" }}>대여 및 반납이 완료된 거래입니다.</span>
                        {isOwner && (
                          <button
                            type="button"
                            onClick={() => updateItemStatus(item.id, "AVAILABLE", null)}
                            style={secondaryBtnStyle}
                          >
                            다시 대여 가능으로 전환
                          </button>
                        )}
                      </div>
                    )}

                    {item.status === "AVAILABLE" && isOwner && (
                      <span style={{ fontSize: "13px", color: "#888" }}>홈 화면에 공개되어 대여 신청을 기다리는 중입니다.</span>
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