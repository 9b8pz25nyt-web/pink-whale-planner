import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Ensure this points to your Supabase client

export type Income = { id: number; month: string; amount: number; notes: string; link: string; year: number };

export default function useTaxCalculator(selectedYear: number) {
  const [incomes, setIncomes] = useState<Income[]>([]);

  // 1. Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .eq('year', selectedYear);
      
      if (data) setIncomes(data);
    }
    fetchData();
  }, [selectedYear]);

  // 2. Add entry to Supabase
  const addIncome = async (month: string, amount: number, notes: string, link: string) => {
    const { data, error } = await supabase
      .from('incomes')
      .insert([{ month, amount, notes, link, year: selectedYear }])
      .select();

    if (data) setIncomes([...incomes, ...data]);
  };

  // 3. Delete entry
  const deleteIncome = async (id: number) => {
    await supabase.from('incomes').delete().eq('id', id);
    setIncomes(incomes.filter(inc => inc.id !== id));
  };

  // 4. Edit entry
  const editIncome = async (id: number, amount: number, notes: string, link: string) => {
    await supabase.from('incomes').update({ amount, notes, link }).eq('id', id);
    setIncomes(incomes.map(inc => (inc.id === id ? { ...inc, amount, notes, link } : inc)));
  };

  // Logic for Tax (stays the same)
  const getMonthTotal = (monthName: string) => incomes.filter(i => i.month === monthName).reduce((sum, i) => sum + i.amount, 0);
  const q1 = getMonthTotal('January') + getMonthTotal('February') + getMonthTotal('March');
  const q2 = getMonthTotal('April') + getMonthTotal('May') + getMonthTotal('June');
  const q3 = getMonthTotal('July') + getMonthTotal('August') + getMonthTotal('September');
  const q4 = getMonthTotal('October') + getMonthTotal('November') + getMonthTotal('December');

  const totalGross = q1 + q2 + q3 + q4;
  const EXEMPTION = 250000;
  const RATE = 0.08;
  const q1Tax = Math.max(0, (q1 - EXEMPTION) * RATE);
  const q2Tax = Math.max(0, ((q1 + q2) - EXEMPTION) * RATE) - q1Tax;
  const q3Tax = Math.max(0, ((q1 + q2 + q3) - EXEMPTION) * RATE) - (q1Tax + q2Tax);
  const q4Tax = Math.max(0, (totalGross - EXEMPTION) * RATE) - (q1Tax + q2Tax + q3Tax);

  return { incomes, addIncome, deleteIncome, editIncome, q1Tax, q2Tax, q3Tax, q4Tax, totalGross };
}