import { useState } from "react"; // 1. 리액트에서 useState 도구 불러오기

function App() {
  // 2. count라는 상태 변수와 값을 바꿀 수 있는 setCount 함수 선언 (초기값은 0)
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🌿 4일차 리액트 실습: State(상태) 활용하기</h1>
      <p>현재 카운트: <strong>{count}</strong></p>
      
      {/* 3. 버튼을 누를 때마다 setCount를 통해 count 값이 1씩 증가 */}
      <button 
        onClick={() => setCount(count + 1)}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        숫자 증가 ➕
      </button>
    </div>
  );
}

export default App;