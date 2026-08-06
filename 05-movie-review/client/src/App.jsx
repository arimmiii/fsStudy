import { Routes, Route } from "react-router-dom";
import ReviewList from "../pages/ReviewList";
import ReviewDetail from "../pages/ReviewDetail";
import Signup from "../pages/Signup";
import LogIn from "../pages/LogIn";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ReviewList />} />
      <Route path="/reviews/:id" element={<ReviewDetail />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<LogIn />} />
    </Routes>
  );
}
export default App;
