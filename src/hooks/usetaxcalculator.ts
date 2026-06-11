import { useState, useEffect } from 'react';

export type Income = { id: number; month: string; amount: number; notes: string; link: string };

export default function useTaxCalculator() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- NEW: 1. LOAD DATA FROM MEMORY ---
  // This runs exactly once when you open the website
  useEffect(() => {
    const savedData = localStorage.getItem('pinkWhalePlannerData');
    if (savedData) {
      setIncomes(JSON.parse(savedData));
    }
    setIsLoaded(true); // Tells the app we finished loading!
  }, []);

  // --- NEW: 2. SAVE DATA TO MEMORY ---
  // This runs automatically every single time you add, edit, or delete an income
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pinkWhalePlannerData', JSON.stringify(incomes));
    }
  }, [incomes, isLoaded]);

  // --- The Math (Stays exactly the same) ---
  const getMonthTotal = (monthName: string) => {
    return incomes.filter(i => i.month === monthName).reduce((sum, i) => sum + i.amount, 0);
  };

  const q1 = getMonthTotal('January') + getMonthTotal('February') + getMonthTotal('March');
  const q2 = getMonthTotal('April') + getMonthTotal('May') + getMonthTotal('June');
  const q3 = getMonthTotal('July') + getMonthTotal('August') + getMonthTotal('September');
  const q4 = getMonthTotal('October') + getMonthTotal('November') + getMonthTotal('December');

  const totalGross = q1 + q2 + q3 + q4;
  
  const EXEMPTION_AMOUNT = 250000;
  const TAX_RATE = 0.08;

  const q1Tax = Math.max(0, (q1 - EXEMPTION_AMOUNT) * TAX_RATE);
  const q2Tax = Math.max(0, ((q1 + q2) - EXEMPTION_AMOUNT) * TAX_RATE) - q1Tax;
  const q3Tax = Math.max(0, ((q1 + q2 + q3) - EXEMPTION_AMOUNT) * TAX_RATE) - (q1Tax + q2Tax);
  const totalTaxDueYearly = Math.max(0, (totalGross - EXEMPTION_AMOUNT) * TAX_RATE);
  const q4Tax = totalTaxDueYearly - (q1Tax + q2Tax + q3Tax);

  // --- The Functions (Stay exactly the same) ---
  const addIncome = (month: string, amount: number, notes: string, link: string) => {
    setIncomes([{ id: Date.now(), month, amount, notes, link }, ...incomes]);
  };

  const deleteIncome = (id: number) => {
    setIncomes(incomes.filter(inc => inc.id !== id));
  };

  const editIncome = (id: number, newAmount: number, newNotes: string, newLink: string) => {
    setIncomes(incomes.map(inc => 
      inc.id === id ? { ...inc, amount: newAmount, notes: newNotes, link: newLink } : inc
    ));
  };

  return { 
    incomes, addIncome, deleteIncome, editIncome, 
    q1, q2, q3, q4, 
    q1Tax, q2Tax, q3Tax, q4Tax, 
    totalGross 
  };
}