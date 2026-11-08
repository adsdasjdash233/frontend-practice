import UserCard from "./UserCard";

// 사용자 목록 전체를 관리하고 렌더링하는 컴포넌트
function UserList({ users }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </ul>
  );
}

export default UserList;