import { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs } from "../config/firebaseConfig";

// Definir la interfaz para un camión
interface Truck {
  id: string;
  plate: string;
  model: string;
}

function App() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [newPlate, setNewPlate] = useState<string>("");
  const [newModel, setNewModel] = useState<string>("");

  // Cargar camiones desde Firebase
  useEffect(() => {
    const fetchTrucks = async () => {
      const querySnapshot = await getDocs(collection(db, "trucks"));
      const truckList: Truck[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Truck, "id">),
      }));
      setTrucks(truckList);
    };
    fetchTrucks();
  }, []);

  // Agregar camión a Firebase
  const addTruck = async () => {
    if (!newPlate.trim() || !newModel.trim()) return;

    const docRef = await addDoc(collection(db, "trucks"), {
      plate: newPlate,
      model: newModel
    });

    setTrucks([...trucks, { id: docRef.id, plate: newPlate, model: newModel }]);
    setNewPlate("");
    setNewModel("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">Lista de Camiones</h1>

        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            value={newPlate}
            onChange={(e) => setNewPlate(e.target.value)}
            placeholder="Patente del camión..."
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
            placeholder="Modelo del camión..."
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addTruck}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Agregar Camión
          </button>
        </div>

        <ul className="space-y-2">
          {trucks.map(truck => (
            <li key={truck.id} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
              {truck.plate} - {truck.model}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;