'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, Shield } from 'lucide-react'; // icons

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

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
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
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-gray-800">
      {/* Profile Picture Placeholder */}
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-4xl mb-6">
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
