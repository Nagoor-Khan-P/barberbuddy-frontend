'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';

interface Saloon {
  id: number;
  name: string;
  address: string;
  city?: string;
  createdAt: string;
}

export default function BarberDashboardPage() {
  const router = useRouter();
  const [saloons, setSaloons] = useState<Saloon[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchSaloons() {
      const token = localStorage.getItem('authToken');
      const barberId = localStorage.getItem('userId');

      if (!token) {
        toast.error('Unauthorized. Please log in.');
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/barber/${barberId}/saloons`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch saloons');
        const data: Saloon[] = await res.json();
        setSaloons(data);
      } catch (err: any) {
        toast.error(err.message || 'Error fetching saloons');
      } finally {
        setLoading(false);
      }
    }

    fetchSaloons();
  }, [baseUrl, router]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex flex-col items-center text-center px-4 py-8">
      
      {/* Common welcome section */}
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome, Barber 👨‍🔧</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-6">
        Manage your profile, register your saloon, and start booking appointments with customers easily.
      </p>

      {/* Register button (always visible) */}
      <Button
        className="mb-10 text-lg px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl bg-black text-white"
        onClick={() => router.push('/barber/register-saloon')}
      >
        Register Your Saloon
      </Button>

      {/* If saloons exist, show them */}
      {saloons.length > 0 ? (
        <div className="max-w-4xl w-full mx-auto p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Registered Saloons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {saloons.map((saloon) => (
              <div
                key={saloon.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => router.push(`/barber/saloon/${saloon.id}`)}
              >
                <h3 className="text-xl font-semibold text-yellow-700">{saloon.name}</h3>
                <p className="text-gray-600">{saloon.address}</p>
                {saloon.city && <p className="text-gray-500 text-sm">{saloon.city}</p>}
                <p className="text-xs text-gray-400 mt-2">
                  Created: {new Date(saloon.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">You have not registered any saloon yet.</p>
      )}
    </div>
  );
}
