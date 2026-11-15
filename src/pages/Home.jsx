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
    alert("대여 신청(예약)이 완료되었습니다.");
    navigate("/rental");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* 상단 타이틀 */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#212529", margin: "0 0 6px 0" }}>Everrent 물품 대여</h2>
        <p style={{ fontSize: "14px", color: "#868e96", margin: 0 }}>우리 캠퍼스 이웃들과 물품을 나눠보세요</p>
      </div>

      {/* 검색창 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="어떤 물품을 찾고 계시나요?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "12px 16px", border: "1px solid #ced4da", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", outline: "none", backgroundColor: "#fff" }}
        />
      </div>

      {/* 검색 결과 분리 영역 */}
      {searchTerm.trim() !== "" && (
        <div style={{ marginBottom: "25px", padding: "16px", backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 12px 0", color: "#495057" }}>
            검색 결과 ({searchResults.length}건)
          </h3>
          {searchResults.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#adb5bd", margin: 0 }}>검색 결과가 없습니다.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {searchResults.map(item => (
                <div key={item.id} style={{ padding: "12px", background: "#f8f9fa", border: "1px solid #e9ecef", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#212529" }}>{item.title}</strong>
                    <div style={{ fontSize: "12px", color: "#868e96", marginTop: "2px" }}>{Number(item.pricePerDay).toLocaleString()}원/일 · {item.category}</div>
                  </div>
                  {item.status === 'AVAILABLE' && item.owner !== currentUser && (
                    <button 
                      onClick={() => handleRequestRental(item.id)}
                      style={{ padding: "6px 12px", backgroundColor: "#ff6f0f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
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

      {/* 대여 가능 물품 목록 */}
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 14px 0", color: "#343a40" }}>대여 가능한 물품</h3>
        {availableItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#adb5bd", fontSize: "14px" }}>
            현재 대여 가능한 물품이 없습니다.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {availableItems.map(item => (
              <div key={item.id} style={{ padding: "18px", border: "1px solid #e9ecef", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: "#ff6f0f", backgroundColor: "#fff4ee", padding: "4px 8px", borderRadius: "4px" }}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2b8a3e" }}>대여 가능</span>
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 4px 0", color: "#212529" }}>{item.title}</h4>
                  <p style={{ fontSize: "13px", color: "#868e96", margin: "0 0 8px 0" }}>{item.description}</p>
                  <div style={{ fontSize: "15px", fontWeight: "bold", color: "#212529" }}>
                    {Number(item.pricePerDay).toLocaleString()}원 <span style={{ fontSize: "12px", fontWeight: "normal", color: "#868e96" }}>/ 1일</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f3f5", paddingTop: "10px", marginTop: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#adb5bd" }}>등록자: {item.owner}</span>
                  {item.owner !== currentUser ? (
                    <button
                      onClick={() => handleRequestRental(item.id)}
                      style={{ padding: "8px 14px", backgroundColor: "#ff6f0f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
                    >
                      대여 신청하기
                    </button>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#adb5bd" }}>내가 올린 물품</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Home.displayName = "Home";

export default Home;