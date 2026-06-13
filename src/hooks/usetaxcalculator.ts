import { useState, useEffect } from 'react';

export type Income = {
  id: number;
  month: string;
  amount: number;
  notes: string;
  link: string;
};

export default function useTaxCalculator(selectedYear: number) {
  // Store data by year: { "2026": [...], "2027": [...] }
  const [dataByYear, setDataByYear] = useState<Record<number, Income[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load all data from storage
  useEffect(() => {
    const savedData = localStorage.getItem('pinkWhalePlannerData');
    if (savedData) {
      setDataByYear(JSON.parse(savedData));
    }
    setIsLoaded(true);
  }, []);

  // 2. Save all data whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pinkWhalePlannerData', JSON.stringify(dataByYear));
    }
  }, [dataByYear, isLoaded]);

  // Get current year's incomes
  const incomes = dataByYear[selectedYear] || [];

  // Helper to calculate totals
  const getMonthTotal = (monthName: string) => incomes.filter(i => i.month === monthName).reduce((sum, i) => sum + i.amount, 0);

  // Tax Logic (Calculated on current year's data)
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

  // --- Functions ---
  // Inside useTaxCalculator hook
const addIncome = (month: string, amount: number, notes: string, link: string) => {
  setDataByYear(prev => {
    const currentYearData = prev[selectedYear] || [];
    const updatedYearData = [{ id: Date.now(), month, amount, notes, link }, ...currentYearData];
    
    return {
      ...prev,
      [selectedYear]: updatedYearData
    };
  });
};

  const deleteIncome = (id: number) => {
    setDataByYear(prev => ({
      ...prev,
      [selectedYear]: (prev[selectedYear] || []).filter(inc => inc.id !== id)
    }));
  };

  const editIncome = (id: number, newAmount: number, newNotes: string, newLink: string) => {
    setDataByYear(prev => ({
      ...prev,
      [selectedYear]: (prev[selectedYear] || []).map(inc => 
        inc.id === id ? { ...inc, amount: newAmount, notes: newNotes, link: newLink } : inc
      )
    }));
  };

  return {
  incomes,
  addIncome,
  deleteIncome,
  editIncome,
  totalGross,
  q1Tax,
  q2Tax,
  q3Tax,
  q4Tax
};
}