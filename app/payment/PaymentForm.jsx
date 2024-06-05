'use client';

import React, { useState } from 'react';

const PaymentForm = () => {
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch('/api/makepayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: 100, // Example amount
              mpesaNumber: '254794711950' // Example phone number
            })
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
          setMessage(`Payment successful! Paid until ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()}`);
          localStorage.setItem('paid_until', Date.now() + 24 * 60 * 60 * 1000);
        } catch (err) {
          setMessage(err.message);
        }
      };
    return (
        <form onSubmit={handleSubmit} className='w-[400px]'>
            <h2>Username: Kuja Resturant</h2>
            <h3>Amount: ksh 100</h3>
            <button type="submit" className='w-[200px] rounded-md bg-slate-600 text-white mt-10'>
                Pay
            </button>
            {message && <div>{message}</div>}
        </form>
    );
};

const Payment = () => (
    <div className="container flex content-center items-center">
        <PaymentForm />
    </div>
);

export default Payment;
