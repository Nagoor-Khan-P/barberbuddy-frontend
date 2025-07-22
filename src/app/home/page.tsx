'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to BarberBuddy 💈</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-6">
        BarberBuddy is your one-stop platform to find and book appointments with the best barbers in your area. Skip the wait and get styled on your schedule!
      </p>
      
      <Button
        className="text-lg px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl"
        onClick={() => router.push('/saloons')}
      >
        Find Nearby Saloons
      </Button>
    </div>
  );
}
