'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { RoleType } from '@/context/AuthContext';

export default function Header() {
  const { authToken, setAuthToken, user } = useAuth(); // Assuming user contains roles
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setAuthToken(null);
    window.location.href = '/login';
  };

  // Determine home route based on user role
  const getHomeRoute = () => {
    if (!authToken || !user || !user.roles) return '/';

    console.log(user);
    const isBarber = user.roles.some((role: RoleType) => role.name === 'BARBER');
    if (isBarber)  return '/barber/home';
    return '/home';
  };

  return (
    <header className="w-full h-16 bg-black px-6 py-4 flex items-center justify-between">
      <Link href={getHomeRoute()} className="flex items-center gap-2">
        <Image src="/logo.svg" alt="BarberBuddy Logo" width={32} height={32} />
        <span className="text-xl font-semibold text-white">BarberBuddy</span>
      </Link>

      {authToken && (
        <div className="relative" ref={dropdownRef}>
          <Image
            src="/user_profile.png"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full cursor-pointer border-2 border-white"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                View Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
