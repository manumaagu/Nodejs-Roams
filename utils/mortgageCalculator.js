export const monthlyPayment = (capital, tae, term) => {
  const i = tae / 100 / 12;
  const n = term * 12;
  const monthly_payment = capital * i / (1 - Math.pow(1 + i, -n));
  
  return parseFloat(monthly_payment.toFixed(2));
};
