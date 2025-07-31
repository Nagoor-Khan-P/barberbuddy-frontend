'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Welcome to BarberBuddy 💈</h1>
        <p className="text-lg sm:text-xl mb-8">
          Your ultimate solution for booking appointments, managing schedules, and discovering top-rated barbers near you.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-black text-white rounded-lg text-lg hover:bg-gray-800 transition text-center"
          >
            Login
          </Link>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-black border border-black rounded-lg text-lg hover:bg-gray-100 transition text-center"
            >
              Register as User
            </Link>

            <Link
              href="/barber/register"
              className="px-6 py-3 bg-white text-black border border-black rounded-lg text-lg hover:bg-gray-100 transition text-center"
            >
              Register as Barber
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
