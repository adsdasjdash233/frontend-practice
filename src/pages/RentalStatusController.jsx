import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        return {
          ...item,
          status: nextStatus,
          renter: renterName !== undefined ? renterName : item.renter
        };
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
  };

  const statusLabels = {
    AVAILABLE: '대여 가능',
    REQUESTED: '예약중', // 수정된 라벨명
    APPROVED: '대여 승인됨',
    RENTED: '대여 중',
    RETURN_REQUESTED: '반납 신청됨',
    RETURNED: '반납 완료'
  };

  // 당근마켓 스타일: 로그인한 사용자와 관련 있는(내가 등록했거나 대여 중/신청한) 내역만 필터링
  const myRelatedItems = items.filter(
    item => item.owner === currentUser || item.renter === currentUser
  );

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>내 대여/등록 관리</h2>
        <span style={{ fontSize: "13px", backgroundColor: "#e5e7eb", padding: "4px 8px", borderRadius: "4px" }}>
          접속 계정: <strong>{currentUser}</strong>
        </span>
      </div>

      {myRelatedItems.length === 0 ? (
        <p style={{ color: "#666", fontSize: "14px" }}>관련된 대여 내역이나 등록한 물품이 없습니다.</p>
      ) : (
        myRelatedItems.map(item => {
          const isOwner = item.owner === currentUser;
          const isRenter = item.renter === currentUser;

          return (
            <div key={item.id} style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "16px" }}>{item.title} ({item.category})</strong>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2563eb" }}>
                  {statusLabels[item.status]}
                </span>
              </div>

              <div style={{ fontSize: "13px", color: "#555" }}>
                <p style={{ margin: "2px 0" }}>1일 대여료: {Number(item.pricePerDay).toLocaleString()}원</p>
                <p style={{ margin: "2px 0" }}>
                  소유자: <strong>{item.owner}</strong> {isOwner && "(나)"} | 
                  대여자: <strong>{item.renter || "없음"}</strong> {isRenter && "(나)"}
                </p>
                <p style={{ margin: "4px 0", color: "#333" }}>{item.description}</p>
              </div>

              <div style={{ marginTop: "6px" }}>
                {item.status === 'REQUESTED' && isOwner && (
                  <button
                    onClick={() => updateItemStatus(item.id, 'APPROVED')}
                    style={{ padding: "8px 12px", backgroundColor: "#16a34a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    대여 승인하기 ({item.renter}님 예약)
                  </button>
                )}
                {item.status === 'REQUESTED' && isRenter && (
                  <span style={{ fontSize: "12px", color: "#d97706" }}>소유자({item.owner})의 예약 승인을 기다리는 중입니다.</span>
                )}

                {item.status === 'APPROVED' && (isOwner || isRenter) && (
                  <button
                    onClick={() => updateItemStatus(item.id, 'RENTED')}
                    style={{ padding: "8px 12px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    물품 수령 및 대여 시작
                  </button>
                )}

                {item.status === 'RENTED' && isRenter && (
                  <button
                    onClick={() => updateItemStatus(item.id, 'RETURN_REQUESTED')}
                    style={{ padding: "8px 12px", backgroundColor: "#d97706", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    반납 신청하기
                  </button>
                )}
                {item.status === 'RENTED' && isOwner && (
                  <span style={{ fontSize: "12px", color: "#666" }}>{item.renter}님이 물품을 대여 중입니다.</span>
                )}

                {item.status === 'RETURN_REQUESTED' && isOwner && (
                  <button
                    onClick={() => updateItemStatus(item.id, 'RETURNED')}
                    style={{ padding: "8px 12px", backgroundColor: "#9333ea", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    반납 확인 및 완료 처리
                  </button>
                )}
                {item.status === 'RETURN_REQUESTED' && isRenter && (
                  <span style={{ fontSize: "12px", color: "#666" }}>소유자({item.owner})의 반납 확인을 기다리는 중입니다.</span>
                )}

                {item.status === 'RETURNED' && (
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: "#16a34a" }}>대여 및 반납이 완료된 거래입니다.</span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default RentalStatusController;