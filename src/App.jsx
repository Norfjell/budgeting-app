import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />

      <main className="p-6">
        <Routes>
          <Route path="/" element={<div>Dashboard Page</div>} />
          <Route path="/transactions" element={<div>Transactions Page</div>} />
          <Route path="/budget" element={<div>Budget Page</div>} />
          <Route path="/reports" element={<div>Reports Page</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;