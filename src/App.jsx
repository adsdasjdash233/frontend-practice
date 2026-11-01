import { useState } from "react";

function App() {
  const [inputText, setInputText] = useState(""); // 1. 입력창 텍스트 상태
  const [todos, setTodos] = useState([]); // 2. 할 일 목록 배열 상태

  // 추가 버튼 클릭 시 실행되는 함수
  const handleAdd = () => {
    if (inputText.trim() === "") return; // 빈 값 방지
    setTodos([...todos, inputText]); // 기존 배열에 새 입력값 추가 (스프레드 연산자)
    setInputText(""); // 입력창 초기화
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🌿 6일차 리액트 실습: Todo 목록 만들기</h1>
      
      {/* 입력 영역 */}
      <input 
        type="text" 
        value={inputText} 
        onChange={(e) => setInputText(e.target.value)} 
        placeholder="할 일을 입력하세요..."
        style={{ padding: "8px", fontSize: "16px", width: "250px", marginRight: "10px" }}
      />
      <button 
        onClick={handleAdd}
        style={{ padding: "8px 15px", fontSize: "16px", cursor: "pointer" }}
      >
        추가 ➕
      </button>

      {/* 목록 출력 영역 */}
      <ul style={{ marginTop: "20px", fontSize: "18px" }}>
        {todos.map((todo, index) => (
          <li key={index} style={{ marginBottom: "8px" }}>
            {todo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;