'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuthToken } = useAuth();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${baseUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Login failed');
      }

      if (!response.ok) throw new Error('Failed to fetch profile');


      const data = await response.json();
      const token = data.token;

      const userResponse = await fetch(`${baseUrl}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await userResponse.json()

      if (!token || !userData) {
        throw new Error("Invalid login response");
      }

      const roleName = userData?.roles?.[0]?.name;

      // Store token and user info
      setAuthToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Role-based redirection
      if (roleName === 'BARBER') {
        router.push('/barber/home');
      } else {
        router.push('/home');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
      <form onSubmit={handleLogin} className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Login to BarberBuddy</h2>

        {error && <p className="mb-4 text-red-600 text-sm text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="text-right text-sm mb-4">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-all"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-black">
          Don’t have an account?
        </p>
        <div className="mt-2 flex justify-center gap-4 text-sm">
          <Link href="/register" className="text-blue-600 hover:underline">
            Register as User
          </Link>
          <span>|</span>
          <Link href="/barber/register" className="text-blue-600 hover:underline">
            Register as Barber
          </Link>
        </div>
      </form>
    </div>
  );
}
