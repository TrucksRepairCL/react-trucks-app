import { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs } from "../../config/firebaseConfig";

interface Cliente {
  id: string;
  nombre: string;
}

interface Camion {
  id: string;
  patente: string;
  modelo: string;
  clienteId: string;
  clienteNombre?: string;
}

const Camiones = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [camiones, setCamiones] = useState<Camion[]>([]);
  const [patente, setPatente] = useState("");
  const [modelo, setModelo] = useState("");
  const [clienteId, setClienteId] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const clientesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Cliente, "id">),
      }));
      setClientes(clientesList);
    };

    const fetchCamiones = async () => {
      const querySnapshot = await getDocs(collection(db, "camiones"));
      const camionesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Camion, "id">),
      }));

      // Obtener nombres de los clientes
      const clientesSnapshot = await getDocs(collection(db, "clientes"));
      const clientesMap = new Map(
        clientesSnapshot.docs.map(doc => [doc.id, doc.data().nombre])
      );

      // Reemplazar clienteId con clienteNombre
      const camionesConClientes = camionesList.map(camion => ({
        ...camion,
        clienteNombre: clientesMap.get(camion.clienteId) || "Desconocido",
      }));

      setCamiones(camionesConClientes);
    };

    fetchClientes();
    fetchCamiones();
  }, []);

  const addCamion = async () => {
    if (!patente.trim() || !modelo.trim() || !clienteId) return;

    const docRef = await addDoc(collection(db, "camiones"), { patente, modelo, clienteId });

    const clienteNombre = clientes.find(cliente => cliente.id === clienteId)?.nombre || "Desconocido";
    setCamiones([...camiones, { id: docRef.id, patente, modelo, clienteId, clienteNombre }]);
    setPatente("");
    setModelo("");
    setClienteId("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Camiones</h1>

      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={patente}
          onChange={(e) => setPatente(e.target.value)}
          placeholder="Patente del camión"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          placeholder="Modelo del camión"
          className="p-2 border rounded"
        />
        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Seleccionar Cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>

        <button
          onClick={addCamion}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Agregar Camión
        </button>
      </div>

      <ul className="space-y-2">
        {camiones.map(camion => (
          <li key={camion.id} className="p-2 border rounded bg-gray-50 text-gray-700">
            {camion.patente} - {camion.modelo} (Dueño: {camion.clienteNombre})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Camiones;
