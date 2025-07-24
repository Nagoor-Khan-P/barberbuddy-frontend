'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MapPin, User, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Saloon {
  id: number;
  name: string;
  address: string;
  barberUsername: string;
  createdAt: string;
  // rating?: number; // Optional: Use this if you have dynamic ratings
}

export default function SaloonsPage() {
  const [saloons, setSaloons] = useState<Saloon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchSaloons = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Unauthorized. Please login.');
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/customer/saloons`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch saloons');
        const data = await res.json();
        setSaloons(data);
      } catch (error) {
        console.error('Error fetching saloons:', error);
        setError('Failed to load saloons');
      } finally {
        setLoading(false);
      }
    };

    fetchSaloons();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading saloons...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (!saloons.length) {
    return <p className="text-center mt-10 text-gray-500">No saloons found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Available Saloons Nearby
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {saloons.map((saloon) => (
          <div
            key={saloon.id}
            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ease-in-out h-64"
          >
            {/* Background image */}
            <Image
              src="/saloons/s1.jpg"
              alt="Saloon background"
              layout="fill"
              objectFit="cover"
              className="z-0"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 z-10 transition duration-300" />

            {/* Content */}
            <div className="relative z-20 p-4 text-white h-full flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">{saloon.name}</h2>

                <p className="text-sm flex items-center gap-1">
                  <MapPin size={16} /> {saloon.address}
                </p>

                {/* Rating (static for now) */}
                <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={star <= 4.5 ? 'fill-yellow-400' : 'text-gray-500'}
                    />
                  ))}
                  <span className="text-xs text-white ml-1">(4.5)</span>
                </div>
              </div>

              <div className="flex items-end justify-between mt-2 text-xs text-gray-200">
                <div>
                  <p className="flex items-center gap-1">
                    <User size={14} /> Barber: {saloon.barberUsername}
                  </p>
                  <p>Created At: {new Date(saloon.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Hidden by default, shown on hover */}
                <button
                  onClick={() => router.push(`/saloon/${saloon.id}`)}
                  className="bg-white text-black text-xs font-medium px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                  View Saloon
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
