
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAccessAllowed } from '../utils/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!isAccessAllowed()) {
      router.push('/payment');
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <h1>Welcome to the App</h1>
      <p>Your content goes here. </p>
    </main>
  );
}
