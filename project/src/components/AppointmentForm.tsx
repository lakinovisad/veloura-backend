import { useState } from "react";
import { createAppointment } from "../services/appointments";

export default function AppointmentForm() {
  const [selectedSalonId, setSelectedSalonId] = useState<string | number>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string | number>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createAppointment({
        salon_id: selectedSalonId,
        service_id: selectedServiceId,
        date: selectedDate || new Date().toISOString()
      });
      
      alert("Termin uspešno zakazan!");
      // Reset form or redirect
    } catch (error) {
      alert("Greška pri zakazivanju termina");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Salon</label>
        <select 
          value={selectedSalonId} 
          onChange={(e) => setSelectedSalonId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Izaberi salon</option>
          {/* Salon options would go here */}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Usluga</label>
        <select 
          value={selectedServiceId} 
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Izaberi uslugu</option>
          {/* Service options would go here */}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Datum i vreme</label>
        <input 
          type="datetime-local" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={loading || !selectedSalonId || !selectedServiceId || !selectedDate}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
      >
        {loading ? "Zakazivanje..." : "Zakaži termin"}
      </button>
    </form>
  );
} 