import { useState } from 'react';

function ItemRegisterForm() {
  // 폼 데이터를 하나의 객체 상태로 관리
  const [formData, setFormData] = useState({
    title: '',
    pricePerDay: '',
    category: 'CAMPING',
    description: ''
  });

  // 입력값이 바뀔 때마다 상태를 업데이트하는 공통 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 폼 제출(등록 버튼 클릭) 시 실행
  const handleSubmit = (e) => {
    e.preventDefault(); // 브라우저 새로고침 방지
    
    console.log('백엔드 API로 전송될 물품 폼 데이터:', formData);
    alert('물품 등록 폼 데이터가 콘솔에 출력되었습니다!');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>대여 물품 등록</h2>
      
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
        placeholder="1일 대여료"
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