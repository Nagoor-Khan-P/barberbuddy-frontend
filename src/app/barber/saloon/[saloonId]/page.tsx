'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Saloon {
  id: number;
  name: string;
  address: string;
  barberUsername: string;
  createdAt: string;
}

interface Slot {
  id: number;
  date: string;
  time: string;
  booked: boolean;
  saloonId: number;
}

export default function ViewSaloonPage() {
  const { saloonId } = useParams();
  const [saloon, setSaloon] = useState<Saloon | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', address: '' });
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!saloonId) return;

    async function fetchData() {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Unauthorized. Please login.');
        return;
      }

      try {
        // Fetch saloon details
        const saloonRes = await fetch(`${baseUrl}/barber/saloon/${saloonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!saloonRes.ok) throw new Error('Failed to load saloon');

        const saloonData: Saloon = await saloonRes.json();
        setSaloon(saloonData);
        setForm({ name: saloonData.name, address: saloonData.address });

        // Fetch slots
        const slotsRes = await fetch(`${baseUrl}/barber/saloon/${saloonId}/slots`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!slotsRes.ok) throw new Error('Failed to load slots');

        const slotData: Slot[] = await slotsRes.json();
        setSlots(slotData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [saloonId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Unauthorized. Please login.');
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/barber/saloon/${saloonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to update saloon');

      toast.success('Saloon updated successfully');
      setSaloon((prev) => prev ? { ...prev, ...form } : prev);
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>;
  if (!saloon) return <p className="text-center mt-10">No saloon found.</p>;

  const getSlotStatus = (booked: boolean) => (booked ? 'booked' : 'available');

  const formatTime = (time: string) => {
    const date = new Date(`1970-01-01T${time}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getColorClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 text-white';
      case 'booked':
        return 'bg-red-400 text-white';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Saloon Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-600">Saloon Profile</h2>
          <Button className="bg-yellow-500 text-white hover:bg-yellow-600" onClick={() => setShowModal(true)}>
            Edit
          </Button>
        </div>
        <div className="space-y-3 text-gray-700 text-lg">
          <div className="flex justify-between">
            <span className="font-semibold">Saloon Name:</span>
            <span>{saloon.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Address:</span>
            <span>{saloon.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Barber Username:</span>
            <span>{saloon.barberUsername}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Created At:</span>
            <span>{new Date(saloon.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Slot Status Display */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Today's Slots</h2>
        {slots.length === 0 ? (
          <p className="text-center text-gray-500">No slots created for today.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots.map((slot) => {
              const status = getSlotStatus(slot.booked);
              return (
                <div
                  key={slot.id}
                  className={`px-4 py-2 rounded text-center font-semibold text-sm border ${getColorClass(status)}`}
                >
                  <span>{formatTime(slot.time)}</span>
                </div>
              );
            })}
          </div>
        )}
        <p className="text-sm text-gray-500 mt-4">
          <span className="inline-block w-3 h-3 bg-green-500 mr-2 rounded-full"></span> Available
          <span className="inline-block w-3 h-3 bg-red-400 ml-4 mr-2 rounded-full"></span> Booked
        </p>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Saloon</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-black text-white">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
