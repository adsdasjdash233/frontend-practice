import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ItemRegisterForm() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [isLoggedIn, currentUser, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    pricePerDay: '',
    category: 'CAMPING',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.pricePerDay) {
      alert("물품 제목과 대여료를 입력해주세요.");
      return;
    }

    const existingItems = JSON.parse(localStorage.getItem("items")) || [];

    const newItem = {
      id: Date.now(),
      ...formData,
      owner: currentUser,     // 현재 로그인한 사용자가 소유자로 지정
      renter: null,           // 초기 대여자 없음
      status: 'AVAILABLE'     // 초기 대여 상태
    };

    localStorage.setItem("items", JSON.stringify([...existingItems, newItem]));
    alert(`'${formData.title}' 물품이 등록되었습니다.`);
    navigate("/rental");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
      <h2>대여 물품 등록</h2>
      <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>등록자(소유자): <strong>{currentUser}</strong></p>
      
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="물품 제목"
        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
      />
      
      <input
        name="pricePerDay"
        type="number"
        value={formData.pricePerDay}
        onChange={handleChange}
        placeholder="1일 대여료 (원)"
        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
      />
      
      <select 
        name="category" 
        value={formData.category} 
        onChange={handleChange}
        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
      >
        <option value="CAMPING">캠핑</option>
        <option value="CAMERA">촬영</option>
        <option value="TOOL">공구</option>
        <option value="LIFE">생활</option>
      </select>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="물품 설명"
        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", height: "100px" }}
      />
      
      <button type="submit" style={{ padding: "10px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
        등록하기
      </button>
    </form>
  );
}

export default ItemRegisterForm;