import { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs } from "../../config/firebaseConfig";

interface Cliente {
    id: string;
    nombre: string;
    rut: string;
  }
  
  const Clientes = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [nombre, setNombre] = useState<string>("");
    const [rut, setRut] = useState<string>("");
  
    // Cargar clientes desde Firebase
    useEffect(() => {
      const fetchClientes = async () => {
        const querySnapshot = await getDocs(collection(db, "clientes"));
        const clientesList: Cliente[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Cliente, "id">),
        }));
        setClientes(clientesList);
      };
      fetchClientes();
    }, []);
  
    // Agregar cliente a Firebase
    const addCliente = async () => {
      if (!nombre.trim() || !rut.trim()) return;
  
      const docRef = await addDoc(collection(db, "clientes"), { nombre, rut });
  
      setClientes([...clientes, { id: docRef.id, nombre, rut }]);
      setNombre("");
      setRut("");
    };
  
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">Lista de Clientes</h1>
  
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del cliente..."
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              placeholder="RUT..."
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={addCliente}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Agregar Cliente
            </button>
          </div>
  
          <ul className="space-y-2">
            {clientes.map(cliente => (
              <li key={cliente.id} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                {cliente.nombre} - {cliente.rut}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default Clientes;