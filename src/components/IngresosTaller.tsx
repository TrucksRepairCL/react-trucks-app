import { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs } from "../../config/firebaseConfig";

interface Cliente {
  id: string;
  nombre: string;
}

interface Vehiculo {
  id: string;
  patente: string;
  modelo: string;
}

interface IngresoTaller {
  id: string;
  clienteId: string;
  clienteNombre?: string;
  vehiculoId: string;
  vehiculoInfo?: string;
  trabajo: string;
}

const IngresosTaller = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [ingresos, setIngresos] = useState<IngresoTaller[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");
  const [trabajo, setTrabajo] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      setClientes(querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Cliente, "id">) })));
    };

    const fetchVehiculos = async () => {
      const querySnapshot = await getDocs(collection(db, "camiones"));
      setVehiculos(querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Vehiculo, "id">) })));
    };

    const fetchIngresos = async () => {
      const querySnapshot = await getDocs(collection(db, "ingresos_taller"));
      setIngresos(querySnapshot.docs.map(doc => {
        const data = doc.data() as IngresoTaller;
        return {
          id: doc.id,
          clienteId: data.clienteId,
          clienteNombre: clientes.find(c => c.id === data.clienteId)?.nombre || "Desconocido",
          vehiculoId: data.vehiculoId,
          vehiculoInfo: vehiculos.find(v => v.id === data.vehiculoId)?.patente || "Desconocido",
          trabajo: data.trabajo
        };
      }));
    };

    fetchClientes();
    fetchVehiculos();
    fetchIngresos();
  }, [clientes, vehiculos]);


  const addIngreso = async () => {
    if (!clienteId || !vehiculoId || !trabajo.trim()) return;

    const docRef = await addDoc(collection(db, "ingresos_taller"), { clienteId, vehiculoId, trabajo });
    const clienteNombre = clientes.find(cliente => cliente.id === clienteId)?.nombre || "Desconocido";
    const vehiculoInfo = vehiculos.find(vehiculo => vehiculo.id === vehiculoId)?.patente || "Desconocido";

    setIngresos([...ingresos, { id: docRef.id, clienteId, clienteNombre, vehiculoId, vehiculoInfo, trabajo }]);
    setClienteId("");
    setVehiculoId("");
    setTrabajo("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ingresos a Taller</h1>
      <div className="flex flex-col gap-2 mb-4">
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} className="p-2 border rounded">
          <option value="">Seleccionar Cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
          ))}
        </select>
        <select value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)} className="p-2 border rounded">
          <option value="">Seleccionar Vehículo</option>
          {vehiculos.map(vehiculo => (
            <option key={vehiculo.id} value={vehiculo.id}>{vehiculo.patente} - {vehiculo.modelo}</option>
          ))}
        </select>
        <input type="text" value={trabajo} onChange={(e) => setTrabajo(e.target.value)} placeholder="Trabajo a realizar" className="p-2 border rounded" />
        <button onClick={addIngreso} className="bg-blue-500 text-white p-2 rounded">Agregar Ingreso</button>
      </div>

      <ul className="space-y-2">
        {ingresos.map(ingreso => (
          <li key={ingreso.id} className="p-2 border rounded bg-gray-50 text-gray-700">
            Cliente: {ingreso.clienteNombre} - Vehículo: {ingreso.vehiculoInfo} - Trabajo: {ingreso.trabajo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngresosTaller;
