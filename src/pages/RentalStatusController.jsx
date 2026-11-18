import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ISO 타임스탬프를 보기 쉬운 한국어 형식(YYYY-MM-DD HH:mm)으로 변환하는 유틸리티 함수
const formatDate = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  
  if (isNaN(date.getTime())) return isoString;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

function RentalStatusController() {
  const navigate = useNavigate();
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
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const now = new Date().toISOString();
        return {
          ...item,
          status: nextStatus,
          // null을 넘기면 대여자 초기화(취소/재등록 시), undefined면 기존 유지
          renter: renterName !== undefined ? renterName : item.renter,
          // ERD 기준 대여/반납 일시 기록
          rentedAt: nextStatus === 'RENTED' ? now : item.rentedAt,
          returnedAt: nextStatus === 'RETURNED' ? now : item.returnedAt
        };
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
  };

  // 예약 취소 및 거절 핸들러 (ERD 취소 사유 반영)
  const handleCancelOrReject = (itemId, isOwner) => {
    const actionName = isOwner ? "거절" : "취소";
    const reason = prompt(`${actionName} 사유를 입력해 주세요:`);
    if (reason === null) return; // 프롬프트 닫기 시 중단

    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: 'AVAILABLE',
          renter: null,
          cancelReason: reason.trim() || `${actionName} 처리됨`
        };
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
    alert(`대여 신청이 ${actionName}되었습니다.`);
  };

  const statusLabels = {
    AVAILABLE: '대여 가능',
    REQUESTED: '예약중',
    APPROVED: '대여 승인됨',
    RENTED: '대여 중',
    RETURN_REQUESTED: '반납 신청됨',
    RETURNED: '반납 완료'
  };

  // 로그인한 사용자와 관련 있는(내가 등록했거나 대여 중/신청한) 내역만 필터링
  const myRelatedItems = items.filter(
    item => item.owner === currentUser || item.renter === currentUser
  );

  return (
    <div style={{ backgroundColor: "#f4f5f7", minHeight: "calc(100vh - 53px)", padding: "24px 0 40px 0", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* 상단 헤더 카드 */}
        <div style={{ backgroundColor: "#fff", padding: "20px 24px", borderRadius: "8px", border: "1px solid #e1e2e3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 4px 0" }}>내 대여/등록 관리</h2>
            <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>등록한 물품의 예약 승인 및 대여 중인 물품의 반납 상태를 관리합니다.</p>
          </div>
          <span style={{ fontSize: "13px", backgroundColor: "#f1f3f5", color: "#333", padding: "6px 12px", borderRadius: "4px", border: "1px solid #e5e8eb" }}>
            접속 계정: <strong>{currentUser}</strong>
          </span>
        </div>

        {/* 물품 상태 리스트 */}
        {myRelatedItems.length === 0 ? (
          <div style={{ backgroundColor: "#fff", padding: "60px 20px", borderRadius: "8px", border: "1px solid #e1e2e3", textAlign: "center", color: "#888", fontSize: "14px" }}>
            관련된 대여 내역이나 등록한 물품이 없습니다.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {myRelatedItems.map(item => {
              const isOwner = item.owner === currentUser;
              const isRenter = item.renter === currentUser;

              return (
                <div key={item.id} style={{ padding: "20px 24px", border: "1px solid #e1e2e3", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", color: "#666", backgroundColor: "#f1f3f5", padding: "2px 6px", borderRadius: "4px" }}>
                        {item.category}
                      </span>
                      <strong style={{ fontSize: "16px", color: "#333" }}>{item.title}</strong>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: item.status === 'AVAILABLE' ? "#00c73c" : "#2563eb" }}>
                      {statusLabels[item.status] || item.status}
                    </span>
                  </div>

                  <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.6" }}>
                    <p style={{ margin: "2px 0" }}>1일 대여료: <strong>{Number(item.pricePerDay).toLocaleString()}원</strong></p>
                    <p style={{ margin: "2px 0" }}>
                      소유자: <strong>{item.owner}</strong> {isOwner && <span style={{ color: "#00c73c", fontWeight: "bold" }}>(나)</span>} |{" "}
                      대여자: <strong>{item.renter || "없음"}</strong> {isRenter && <span style={{ color: "#2563eb", fontWeight: "bold" }}>(나)</span>}
                    </p>
                    <p style={{ margin: "6px 0 0 0", color: "#666" }}>{item.description}</p>

                    {/* ERD 타임스탬프 정보 표기 영역 추가 */}
                    <div style={{ marginTop: "8px", fontSize: "11px", color: "#888", display: "flex", gap: "12px", borderTop: "1px dashed #f1f3f5", paddingTop: "6px" }}>
                      <span>등록일시: {formatDate(item.createdAt)}</span>
                      {item.rentedAt && <span>대여시작: {formatDate(item.rentedAt)}</span>}
                      {item.returnedAt && <span>반납완료: {formatDate(item.returnedAt)}</span>}
                    </div>
                  </div>

                  {/* 상태별 액션 버튼 영역 */}
                  <div style={{ marginTop: "6px", paddingTop: "12px", borderTop: "1px solid #f1f3f5", display: "flex", alignItems: "center", gap: "8px" }}>
                    
                    {/* 1. 예약 신청됨 (REQUESTED) */}
                    {item.status === 'REQUESTED' && isOwner && (
                      <>
                        <button
                          onClick={() => updateItemStatus(item.id, 'APPROVED')}
                          style={{ padding: "8px 14px", backgroundColor: "#00c73c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
                        >
                          대여 승인하기 ({item.renter}님 예약)
                        </button>
                        <button
                          onClick={() => handleCancelOrReject(item.id, true)}
                          style={{ padding: "8px 14px", backgroundColor: "#fff", color: "#d9534f", border: "1px solid #d9534f", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                        >
                          예약 거절
                        </button>
                      </>
                    )}
                    {item.status === 'REQUESTED' && isRenter && (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "13px", color: "#d97706", fontWeight: "bold" }}>소유자({item.owner})의 예약 승인을 기다리는 중입니다.</span>
                        <button
                          onClick={() => handleCancelOrReject(item.id, false)}
                          style={{ padding: "6px 12px", backgroundColor: "#fff", color: "#666", border: "1px solid #d0d5dd", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                        >
                          신청 취소
                        </button>
                      </div>
                    )}

                    {/* 2. 대여 승인됨 (APPROVED) */}
                    {item.status === 'APPROVED' && (isOwner || isRenter) && (
                      <button
                        onClick={() => updateItemStatus(item.id, 'RENTED')}
                        style={{ padding: "8px 14px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
                      >
                        물품 수령 및 대여 시작
                      </button>
                    )}

                    {/* 3. 대여 중 (RENTED) */}
                    {item.status === 'RENTED' && isRenter && (
                      <button
                        onClick={() => updateItemStatus(item.id, 'RETURN_REQUESTED')}
                        style={{ padding: "8px 14px", backgroundColor: "#d97706", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
                      >
                        반납 신청하기
                      </button>
                    )}
                    {item.status === 'RENTED' && isOwner && (
                      <span style={{ fontSize: "13px", color: "#666" }}>{item.renter}님이 물품을 대여 중입니다.</span>
                    )}

                    {/* 4. 반납 신청됨 (RETURN_REQUESTED) */}
                    {item.status === 'RETURN_REQUESTED' && isOwner && (
                      <button
                        onClick={() => updateItemStatus(item.id, 'RETURNED')}
                        style={{ padding: "8px 14px", backgroundColor: "#9333ea", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
                      >
                        반납 확인 및 완료 처리
                      </button>
                    )}
                    {item.status === 'RETURN_REQUESTED' && isRenter && (
                      <span style={{ fontSize: "13px", color: "#666" }}>소유자({item.owner})의 반납 확인을 기다리는 중입니다.</span>
                    )}

                    {/* 5. 반납 완료 (RETURNED) -> 재대여 활성화 옵션 추가 */}
                    {item.status === 'RETURNED' && (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "bold", color: "#16a34a" }}>대여 및 반납이 완료된 거래입니다.</span>
                        {isOwner && (
                          <button
                            onClick={() => updateItemStatus(item.id, 'AVAILABLE', null)}
                            style={{ padding: "6px 12px", backgroundColor: "#f8f9fa", color: "#333", border: "1px solid #d0d5dd", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                          >
                            다시 대여 가능으로 전환
                          </button>
                        )}
                      </div>
                    )}

                    {/* 6. 현재 대여 대기 중 (AVAILABLE) */}
                    {item.status === 'AVAILABLE' && isOwner && (
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