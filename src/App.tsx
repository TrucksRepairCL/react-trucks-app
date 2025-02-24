import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Camiones from "./components/Camiones"; // Tu lista de camiones
import Clientes from "./components/Clientes"; // Nueva ventana para clientes
import IngresosTaller from "./components/IngresosTaller"; // Nueva ventana para clientes

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-6 flex space-x-6">
        <Link to="/clientes" className="text-blue-500 hover:underline"> Clientes /</Link>
          <Link to="/camiones" className="text-blue-500 hover:underline"> Camiones /</Link>
          <Link to="/ingresos-taller" className="text-blue-500 hover:underline"> Ingresos a Taller</Link>
        </nav>
        <Routes>
          <Route path="/camiones" element={<Camiones />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/ingresos-taller" element={<IngresosTaller />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;