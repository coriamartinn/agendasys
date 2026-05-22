import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/login.jsx";
import { Register } from "./components/register.jsx";
import { ProtectedRoute } from "./components/routes/protectedRoute.jsx";
import { AdminPanel } from "./components/adminPanel.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/adminPanel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
