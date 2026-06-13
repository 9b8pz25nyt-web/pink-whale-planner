import Head from 'next/head';
import { useState } from 'react';
import useTaxCalculator, { Income } from '../hooks/usetaxcalculator';

type Quarter = 'q1' | 'q2' | 'q3' | 'q4';

// Component that recreates the pretty rounded cards from IMG_5054.jpg
const MonthDropdown = ({ month, incomes, onAdd, onDelete, onEdit }: {
  month: string;
  incomes: Income[];
  onAdd: (month: string, amount: number, notes: string, link: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, amount: number, notes: string, link: string) => void;
}) => {
  const monthIncomes = incomes.filter((inc) => inc.month === month);
  const total = monthIncomes.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div style={{ marginBottom: '15px', padding: '15px', border: '2px solid #F472B6', borderRadius: '20px', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <b style={{ color: '#F472B6', fontSize: '1.1rem' }}>{month}</b>
        <span style={{ color: '#F472B6' }}>₱{total.toLocaleString()} ▾</span>
      </div>

      <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
        <input placeholder="Amount (₱)" style={{ width: '30%', borderRadius: '10px', border: '1px solid #FBCFE8', padding: '8px' }} />
        <input placeholder="description" style={{ flex: 1, borderRadius: '10px', border: '1px solid #FBCFE8', padding: '8px' }} />
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <input placeholder="paste link here" style={{ flex: 1, borderRadius: '10px', border: '1px solid #FBCFE8', padding: '8px' }} />
        <button style={{ backgroundColor: '#F472B6', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 15px', cursor: 'pointer' }}>+ Add</button>
      </div>
    </div>
  );
};

export default function Home() {
  const { incomes, addIncome, deleteIncome, editIncome, q1Tax, q2Tax, q3Tax, q4Tax } = useTaxCalculator();
  
  // State to store tax certificate links
  const [taxLinks, setTaxLinks] = useState<Record<Quarter, string>>({
    q1: '', q2: '', q3: '', q4: ''
  });

  const handlePasteLink = (quarter: Quarter) => {
    const url = prompt(`Paste your BIR certificate link for ${quarter.toUpperCase()}:`);
    if (url) {
      setTaxLinks((prev) => ({ ...prev, [quarter]: url }));
    }
  };

  const quarters = [
    { name: 'Q1: Jan - Mar', months: ['January', 'February', 'March'], tax: q1Tax, key: 'q1' as Quarter },
    { name: 'Q2: Apr - Jun', months: ['April', 'May', 'June'], tax: q2Tax, key: 'q2' as Quarter },
    { name: 'Q3: Jul - Sep', months: ['July', 'August', 'September'], tax: q3Tax, key: 'q3' as Quarter },
    { name: 'Q4: Oct - Dec', months: ['October', 'November', 'December'], tax: q4Tax, key: 'q4' as Quarter },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: '"Mali", sans-serif', backgroundColor: '#FFF5F7', minHeight: '100vh' }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Mali:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      
      <h1 style={{ color: '#F472B6', textAlign: 'center', marginBottom: '20px', fontSize: '1.6rem' }}>My Financial Planner 🐳</h1>

      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        {/* Tax Summary Box */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', border: '2px solid #F472B6', marginBottom: '30px' }}>
          <h2 style={{ color: '#F472B6', fontSize: '1.1rem', marginTop: 0 }}>Quarterly Tax Due</h2>
          {quarters.map((q) => (
            <div key={q.key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>{q.name.split(':')[0]}: <b>₱{q.tax.toLocaleString()}</b></span>
              <button 
                onClick={() => handlePasteLink(q.key)}
                style={{ cursor: 'pointer', color: taxLinks[q.key] ? '#065F46' : '#F472B6', textDecoration: 'underline', background: 'none', border: 'none', fontSize: '0.9rem' }}
              >
                {taxLinks[q.key] ? 'View Link ✅' : 'Paste Link'}
              </button>
            </div>
          ))}
        </div>

        {/* Organized Quarters */}
        {quarters.map((q) => (
          <div key={q.name} style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#F472B6', fontSize: '1.2rem', marginBottom: '10px' }}>{q.name}</h3>
            {q.months.map((m) => (
              <MonthDropdown key={m} month={m} incomes={incomes} onAdd={addIncome} onDelete={deleteIncome} onEdit={editIncome} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}