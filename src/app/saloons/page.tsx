'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Saloon {
  id: number;
  name: string;
  address: string;
  barberUsername: string;
  createdAt: string;
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
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Available Saloons Nearby
      </h1>

      {/* Mock Map View */}
      <div className="w-full h-56 mb-6 rounded-xl overflow-hidden shadow-md bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
        🗺️ Map View (coming soon)
      </div>

      {/* Saloons List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {saloons.map((saloon) => (
          <div
            key={saloon.id}
            onClick={() => router.push(`/saloon/${saloon.id}`)}
            className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
          >
            {/* Background image */}
            <div className="relative h-48 w-full">
              <Image
                src="/saloons/s1.jpg"
                alt="Saloon background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
              <h2 className="text-lg font-bold">{saloon.name}</h2>

              <p className="text-sm flex items-center gap-1">
                <MapPin size={14} /> {saloon.address}
              </p>

              {/* Rating (static 4.5 for now) */}
              <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= 4.5 ? 'fill-yellow-400' : 'text-gray-500'}
                  />
                ))}
                <span className="text-xs text-gray-200 ml-1">(4.5)</span>
              </div>

              {/* Distance placeholder */}
              <p className="text-xs text-gray-300 mt-1">~2.1 km away</p>

              {/* CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent parent onClick
                  router.push(`/saloon/${saloon.id}`);
                }}
                className="mt-3 bg-white text-black text-xs font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
