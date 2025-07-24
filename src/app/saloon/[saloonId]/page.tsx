'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Saloon {
  id: number;
  name: string;
  address: string;
  barberUsername: string;
  createdAt: string;
  imageUrl?: string;
}

interface Slot {
  id: number;
  date: string;
  time: string;
  booked: boolean;
  saloonId: number;
}

export default function SaloonDetailsPage() {
  const { saloonId } = useParams();
  const router = useRouter();

  const [saloon, setSaloon] = useState<Saloon | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!saloonId) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Unauthorized. Please login.');
      return;
    }

    const fetchDetails = async () => {
      try {
        const [saloonRes, slotsRes] = await Promise.all([
          fetch(`${baseUrl}/customer/saloons/${saloonId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${baseUrl}/customer/saloons/${saloonId}/slots`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!saloonRes.ok) throw new Error('Failed to fetch saloon');
        if (!slotsRes.ok) throw new Error('Failed to fetch slots');

        const saloonData = await saloonRes.json();
        const slotData = await slotsRes.json();

        setSaloon(saloonData);
        setSlots(slotData);
      } catch (err: any) {
        console.error(err);
        toast.error('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [saloonId]);

  const handleBook = async (slot: Slot) => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      toast.error('Unauthorized. Please login.');
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/bookings/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          saloonId: parseInt(saloonId as string),
          slotId: slot.id,
          date: slot.date,
          time: slot.time,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Booking failed.');

      toast.success(result.message || 'Booking successful!');

      setSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, booked: true } : s))
      );
    } catch (err: any) {
      toast.error(err.message || 'Booking failed.');
    }
  };

  const handleBackClick = () => {
    router.push('/saloons');
  };

  return (
    <div className="p-6 relative">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="mb-6 px-5 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 font-medium 
                  hover:bg-gray-300 hover:shadow-md hover:scale-105 transition duration-300 transform cursor-pointer"
      >
        ← Back to Saloons
      </button>

      {/* Saloon Info */}
      {saloon && (
        <div className="mb-10 border rounded-xl shadow p-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{saloon.name}</h1>
          <p className="text-gray-700 mb-1"><strong>Address:</strong> {saloon.address}</p>
          <p className="text-gray-700 mb-1"><strong>Barber:</strong> {saloon.barberUsername}</p>
          {saloon.imageUrl && (
            <img
              src={saloon.imageUrl}
              alt={saloon.name}
              className="mt-4 rounded-lg w-full max-w-md"
            />
          )}
        </div>
      )}

      {/* Slots Section */}
      <h2 className="text-2xl font-semibold mb-4 text-center">Available Slots</h2>
      {slots.length === 0 ? (
        <p className="text-center">No slots available.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`group w-64 border p-4 rounded-xl shadow hover:shadow-lg hover:scale-105 transition transform text-center relative ${
                slot.booked ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'
              }`}
            >
              <div className="font-medium text-lg">
                {slot.date} at {slot.time}
              </div>
              <div
                className={`mt-2 font-semibold ${
                  slot.booked ? 'text-red-500' : 'text-green-600'
                }`}
              >
                {slot.booked ? 'Booked' : 'Available'}
              </div>

              {!slot.booked && (
                <button
                  onClick={() => handleBook(slot)}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-1 rounded opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  Book Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
