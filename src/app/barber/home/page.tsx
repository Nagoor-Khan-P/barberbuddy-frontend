'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function BarberDashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome, Barber 👨‍🔧</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-6">
        Manage your profile, register your saloon, and start booking appointments with customers easily.
      </p>
      
      <Button
        className="text-lg px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl bg-black text-white"
        onClick={() => router.push('/barber/register-saloon')}
      >
        Register Your Saloon
      </Button>
    </div>
  );
}
