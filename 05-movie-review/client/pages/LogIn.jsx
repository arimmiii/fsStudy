import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token); //토큰 저장
      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      console.log("로그인 실패", error);
      alert("로그인 실패");
    }
  }

  return (
    <div style={{ padding: "16px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>로그인</h1>
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

        <button type="submit" style={{ width: "100%", padding: "8px" }}>
          로그인
        </button>
      </form>
    </div>
  );
}

export default LogIn;
