'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-700 hover:text-black p-2"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}
