import { useState } from "react";

function App() {
  // 사용자가 입력하는 텍스트를 저장할 상태
  const [text, setText] = useState("");

  // 입력창에 글자가 바뀔 때마다 실행되는 함수
  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🌿 5일차 리액트 실습: 입력값 다루기</h1>
      
      {/* 사용자 입력을 받는 인풋박스 */}
      <input 
        type="text" 
        value={text} 
        onChange={handleChange} 
        placeholder="글을 입력해 보세요..."
        style={{ padding: "8px", fontSize: "16px", width: "250px", marginRight: "10px" }}
      />
      
      {/* 입력 초기화 버튼 */}
      <button 
        onClick={() => setText("")}
        style={{ padding: "8px 12px", cursor: "pointer" }}
      >
        초기화
      </button>

      <p style={{ marginTop: "20px" }}>
        내가 입력한 내용: <strong>{text || "아직 입력된 내용이 없습니다."}</strong>
      </p>
    </div>
  );
}

export default App;