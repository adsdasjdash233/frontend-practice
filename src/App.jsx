import { useState } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  // 단순히 문자열만 담던 배열에서 id, text, isDone 객체를 포함하는 배열로 관리
  const [todos, setTodos] = useState([]);

  // 1. 할 일 추가
  const handleAdd = () => {
    if (inputText.trim() === "") return;
    const newTodo = {
      id: Date.now(), // 고유한 ID 값 생성
      text: inputText,
      isDone: false, // 완료 여부 (초기값 false)
    };
    setTodos([...todos, newTodo]);
    setInputText("");
  };

  // 2. 완료 상태 토글 (클릭 시 취소선)
  const handleToggle = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

  // 3. 할 일 삭제 (filter 사용)
  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "450px" }}>
      <h1>🌿 7일차 리액트 실습: Todo 완료/삭제</h1>

      {/* 입력 영역 */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="할 일을 입력하세요..."
          style={{ flex: 1, padding: "8px", fontSize: "16px" }}
        />
        <button onClick={handleAdd} style={{ padding: "8px 12px", cursor: "pointer" }}>
          추가
        </button>
      </div>

      {/* 목록 출력 영역 */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span
              onClick={() => handleToggle(todo.id)}
              style={{
                cursor: "pointer",
                textDecoration: todo.isDone ? "line-through" : "none",
                color: todo.isDone ? "#888" : "#000",
              }}
            >
              {todo.isDone ? "✅ " : "⬜ "}
              {todo.text}
            </span>
            <button
              onClick={() => handleDelete(todo.id)}
              style={{
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;