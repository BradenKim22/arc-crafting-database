import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UserInventory from "./pages/UserInventory";
import Recipes from "./pages/Recipes";
import Sessions from "./pages/Sessions";
import Registry from "./pages/Registry";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <nav style={{ width: 220, background: "#222", color: "white", padding: 20, height: "100vh" }}>
          <h2>Game Admin</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><Link to="/" style={{color:"white"}}>Dashboard</Link></li>
            <li><Link to="/inventory" style={{color:"white"}}>User Inventory</Link></li>
            <li><Link to="/recipes" style={{color:"white"}}>Crafting Recipes</Link></li>
            <li><Link to="/sessions" style={{color:"white"}}>Active Sessions</Link></li>
            <li><Link to="/registry" style={{color:"white"}}>Item Registry</Link></li>
          </ul>
        </nav>

        <div style={{ padding: 20, flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<UserInventory />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/registry" element={<Registry />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;