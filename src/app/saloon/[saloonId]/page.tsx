'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {MapPin, User } from 'lucide-react';

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
    <div className="p-0">

      {/* Saloon Header */}
      {saloon && (
        <div className="relative w-full h-64 md:h-80">
          <img
            src={saloon.imageUrl || '/saloons/s1.jpg'}
            alt={saloon.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
            <h1 className="text-3xl font-bold">{saloon.name}</h1>
            <p className="flex items-center gap-1 text-sm mt-1">
              <MapPin size={16} /> {saloon.address}
            </p>
            <p className="flex items-center gap-1 text-sm mt-1">
              <User size={16} /> Barber: {saloon.barberUsername}
            </p>
          </div>
        </div>
      )}

      {/* Slots Section */}
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">Available Slots</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading slots...</p>
        ) : slots.length === 0 ? (
          <p className="text-center text-gray-500">No slots available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`relative rounded-xl border p-4 text-center shadow transition ${
                  slot.booked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white hover:shadow-lg hover:scale-105 cursor-pointer'
                }`}
              >
                <p className="font-medium">{slot.date}</p>
                <p className="text-sm">{slot.time}</p>
                <p
                  className={`mt-2 font-semibold ${
                    slot.booked ? 'text-red-500' : 'text-green-600'
                  }`}
                >
                  {slot.booked ? 'Booked' : 'Available'}
                </p>

                {!slot.booked && (
                  <button
                    onClick={() => handleBook(slot)}
                    className="mt-3 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    Book Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
