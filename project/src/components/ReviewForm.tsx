import { useState } from "react";
import { createReview } from "../services/reviews";

interface ReviewFormProps {
  salonId: string | number;
  onSuccess?: () => void;
}

export default function ReviewForm({ salonId, onSuccess }: ReviewFormProps) {
  const [ocena, setOcena] = useState<number>(5);
  const [komentar, setKomentar] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createReview({
        salon_id: salonId,
        ocena,
        komentar
      });
      
      alert("Recenzija uspešno dodata!");
      setKomentar("");
      setOcena(5);
      onSuccess?.();
    } catch (error) {
      alert("Greška pri dodavanju recenzije");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Ocena</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setOcena(rating)}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                ocena >= rating 
                  ? "bg-yellow-400 border-yellow-500 text-yellow-800" 
                  : "bg-gray-100 border-gray-300 text-gray-500"
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {ocena === 1 && "Veoma loše"}
          {ocena === 2 && "Loše"}
          {ocena === 3 && "Prosečno"}
          {ocena === 4 && "Dobro"}
          {ocena === 5 && "Odlično"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Komentar</label>
        <textarea
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
          placeholder="Podelite svoje iskustvo..."
          className="w-full p-3 border rounded-md resize-none"
          rows={4}
          required
          minLength={10}
        />
        <p className="text-xs text-gray-500 mt-1">
          {komentar.length}/500 karaktera
        </p>
      </div>

      <button 
        type="submit" 
        disabled={loading || !komentar.trim() || komentar.length < 10}
        className="w-full bg-blue-500 text-white p-3 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? "Dodavanje..." : "Dodaj recenziju"}
      </button>
    </form>
  );
} 