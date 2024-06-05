export const isAccessAllowed = () => {
    const paidUntil = localStorage.getItem('paid_until');
    return paidUntil && Date.now() < new Date(paidUntil);
  };
  