import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ItemRegisterForm() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = localStorage.getItem("currentUser");

  // ERD 기준 물품(Item) 필드 구조에 맞춘 상태값 정의
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('전자기기');
  const [pricePerDay, setPricePerDay] = useState('');
  const [description, setDescription] = useState('');

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
      status: 'AVAILABLE', // 초기 상태: 대여 가능
      viewCount: 0, // ERD 조회수 기본값 반영
      createdAt: new Date().toISOString() // 등록일시
    };

    // 리스트에 추가 후 저장
    const updatedItems = [newItem, ...existingItems];
    localStorage.setItem("items", JSON.stringify(updatedItems));

    alert("물품이 성공적으로 등록되었습니다!");
    navigate("/");
  };

  return (
    <div style={{ backgroundColor: "#f4f5f7", minHeight: "calc(100vh - 53px)", padding: "40px 20px", fontFamily: "sans-serif", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", backgroundColor: "#fff", padding: "32px", borderRadius: "8px", border: "1px solid #e1e2e3" }}>
        
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", marginBottom: "8px" }}>캠퍼스 물품 등록</h2>
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "24px" }}>대여 가능한 물품 정보를 정확하게 입력해 주세요.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* 등록자 정보 (읽기 전용) */}
          <div style={{ fontSize: "13px", color: "#555" }}>
            <span style={{ fontWeight: "bold", color: "#333" }}>등록자(소유자): </span> 
            {currentUser || "비회원"}
          </div>

          {/* 물품 제목 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>물품 제목</label>
            <input
              type="text"
              placeholder="예: 공학용 계산기 TI-nspire CX II"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ padding: "12px 14px", border: "1px solid #d0d5dd", borderRadius: "4px", fontSize: "14px", outline: "none" }}
              required
            />
          </div>

          {/* 1일 대여료 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>1일 대여료 (원)</label>
            <input
              type="number"
              placeholder="숫자만 입력하세요 (예: 3000)"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              style={{ padding: "12px 14px", border: "1px solid #d0d5dd", borderRadius: "4px", fontSize: "14px", outline: "none" }}
              required
            />
          </div>

          {/* 카테고리 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: "12px 14px", border: "1px solid #d0d5dd", borderRadius: "4px", fontSize: "14px", outline: "none", backgroundColor: "#fff" }}
            >
              <option value="전자기기">전자기기</option>
              <option value="서적/교재">서적/교재</option>
              <option value="캠핑/레저">캠핑/레저</option>
              <option value="생활용품">생활용품</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 물품 설명 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>물품 상세 설명</label>
            <textarea
              placeholder="물품 상태, 거래 희망 장소, 주의사항 등을 상세히 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              style={{ padding: "12px 14px", border: "1px solid #d0d5dd", borderRadius: "4px", fontSize: "14px", outline: "none", resize: "vertical" }}
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            style={{ padding: "14px", backgroundColor: "#00c73c", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", marginTop: "10px" }}
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