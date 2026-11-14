import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(savedItems);
  }, []);

  const availableItems = items.filter(item => item.status === 'AVAILABLE');

  const searchResults = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRequestRental = (itemId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        if (item.owner === currentUser) {
          alert("내가 등록한 물품은 대여 신청할 수 없습니다.");
          return item;
        }
        return {
          ...item,
          status: 'REQUESTED',
          renter: currentUser
        };
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
    alert("대여 신청(예약)이 완료되었습니다. 대여관리 페이지로 이동합니다.");
    navigate("/rental");
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: "0 0 10px 0" }}>Everrent 메인 화면</h2>
        <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>통합 캠퍼스 생활 플랫폼 - 대여 가능 물품 목록</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="검색할 물품명을 입력하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
        />
      </div>

      {searchTerm.trim() !== "" && (
        <div style={{ padding: "15px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 10px 0", color: "#1e293b" }}>
            검색 결과 ({searchResults.length}건)
          </h3>
          {searchResults.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>검색 결과가 없습니다.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {searchResults.map(item => (
                <div key={item.id} style={{ padding: "10px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{item.title}</strong> ({item.category}) - {Number(item.pricePerDay).toLocaleString()}원/일
                    <div style={{ fontSize: "12px", color: "#64748b" }}>상태: {item.status} | 소유자: {item.owner}</div>
                  </div>
                  {item.status === 'AVAILABLE' && item.owner !== currentUser && (
                    <button 
                      onClick={() => handleRequestRental(item.id)}
                      style={{ padding: "6px 10px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                    >
                      대여신청
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 10px 0" }}>현재 대여 가능한 물품</h3>
        {availableItems.length === 0 ? (
          <p style={{ color: "#666", fontSize: "14px" }}>현재 대여 가능한 물품이 없습니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {availableItems.map(item => (
              <div key={item.id} style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "16px" }}>{item.title} ({item.category})</strong>
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: "#16a34a" }}>대여 가능</span>
                </div>
                <div style={{ fontSize: "13px", color: "#555" }}>
                  <p style={{ margin: "2px 0" }}>1일 대여료: {Number(item.pricePerDay).toLocaleString()}원</p>
                  <p style={{ margin: "2px 0" }}>소유자: <strong>{item.owner}</strong></p>
                  <p style={{ margin: "4px 0" }}>{item.description}</p>
                </div>
                {item.owner !== currentUser ? (
                  <button
                    onClick={() => handleRequestRental(item.id)}
                    style={{ padding: "8px 12px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    대여 신청하기
                  </button>
                ) : (
                  <span style={{ fontSize: "12px", color: "#888" }}>내가 등록한 물품입니다.</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;