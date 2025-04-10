import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Settings from "./pages/Settings";
import Interfaces from "./pages/Interfaces";
import InterfaceDetails from "./pages/InterfaceDetails";
import IpAdresses from "./pages/IpAdresses";
import Sidebar from "./components/SideBar";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="p-6 flex-1">
        <Routes>
              <Route path="/" element={<Navigate to="/settings" />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/interfaces" element={<Interfaces />} />
              <Route path="/interfaces/:index" element={<InterfaceDetails />} /> {/* ✅ dynamic route */}
              <Route path="/IpAddress" element={<IpAdresses />} />
</Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
