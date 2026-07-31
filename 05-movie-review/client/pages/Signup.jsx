import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [nickname, setNickname] = useState();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/auth/signup", {
        email,
        password,
        nickname,
      });
      alert("회원가입 성공!");
      navigate("/login");
    } catch (error) {
      console.log("회원가입 실패", error);
      alert("회원가입 실패");
    }
  }

  return (
    <div style={{ padding: "16px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>회원가입</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        <input
          type="nickname"
          placeholder="이름"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "8px" }}>
          가입하기
        </button>
      </form>
    </div>
  );
}

export default Signup;
