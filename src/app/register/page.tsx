'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react'; // Make sure you have 'lucide-react' installed

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

   useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username: userName,
          email,
          phone: phoneNumber,
          password,
          roles: [
            {
              id: 3,
              name: "USER",
              description: "User role"
            }
          ]
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.error)
        setErrorMessage(data.error || "Registration failed");
        return;
      }

      setSuccessMessage(data.message || "Registered successfully!");
      setErrorMessage('');

      // Optional: clear form
      setName('');
      setUserName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setConfirmPassword('');

      // Redirect to login after short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* ✅ Notification Area */}
      {(successMessage || errorMessage) && (
        <div
          className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 px-4 py-3 rounded shadow-md max-w-md w-full flex justify-between items-center z-50
            ${successMessage ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
        >
          <p className="flex-1">{successMessage || errorMessage}</p>
          <button onClick={() => {
            setSuccessMessage('');
            setErrorMessage('');
          }}>
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Registration Form */}
      <div className="flex items-center justify-center h-full py-12">
        <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-black text-center">Register</h2>


          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-3 text-black placeholder-gray-500"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-3 text-black placeholder-gray-500"
            required
          />

          <input
            type="tel"
            placeholder="Phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-3 text-black placeholder-gray-500"
            required
          />

          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-3 text-black placeholder-gray-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-3 text-black placeholder-gray-500"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-3 text-black placeholder-gray-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-all"
          >
            Register
          </button>

          <p className="mt-4 text-center text-sm text-black">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
