'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, Shield, CalendarCheck2 } from 'lucide-react'; // icons

interface Role {
  id: number;
  name: string;
  description: string;
}

interface ProfileData {
  id: number;
  username: string;
  email: string;
  phone: string;
  name: string;
  roles: Role[];
}

interface Booking {
  id: number;
  saloonName: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Unauthorized. Please login.');
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/customer/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile.');
        }

        const data = await res.json();
        setProfile(data);

        // fetch bookings
        const bookingRes = await fetch(`http://localhost:8080/bookings/${data.id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!bookingRes.ok) {
          throw new Error('Failed to fetch bookings.');
        }

        const bookingData = await bookingRes.json();
        setBookings(bookingData);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchProfileAndBookings();
  }, []);

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8 text-gray-800">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-4xl mb-4">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
        <p className="text-sm text-gray-500 mb-4">@{profile.username}</p>

        <div className="w-full space-y-3">
          <ProfileItem icon={<Mail size={18} />} label="Email" value={profile.email} />
          <ProfileItem icon={<Phone size={18} />} label="Phone" value={profile.phone} />
          <ProfileItem icon={<Shield size={18} />} label="Roles" value={profile.roles.map(role => role.name).join(', ')} />
        </div>
      </div>

      {/* Bookings Section */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CalendarCheck2 size={20} />
          Booking History
        </h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="font-semibold">{booking.saloonName} - {booking.serviceName}</div>
                <div className="text-sm text-gray-600">{booking.date} at {booking.time}</div>
                <div className="text-sm text-gray-500">Status: {booking.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-4 border border-gray-100 rounded-lg px-4 py-3 shadow-sm">
      <div className="text-gray-600">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-base font-medium">{value}</span>
      </div>
    </div>
  );
}
