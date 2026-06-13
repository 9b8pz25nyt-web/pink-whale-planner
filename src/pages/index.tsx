import Head from 'next/head';
import { useState } from 'react';
import useTaxCalculator, { Income } from '../hooks/usetaxcalculator';

type Quarter = 'q1' | 'q2' | 'q3' | 'q4';

// New Progress Bar Component
const ProgressBar = ({ current, goal }: { current: number; goal: number }) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  return (
    <div style={{ margin: '20px auto', maxWidth: '400px', padding: '15px', backgroundColor: 'white', borderRadius: '20px', border: '2px solid #FBCFE8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#F472B6', marginBottom: '8px' }}>
        <span>Income Goal Progress</span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <div style={{ width: '100%', height: '15px', backgroundColor: '#FFF5F7', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#F472B6', transition: 'width 0.5s ease-in-out' }} />
      </div>
    </div>
  );
};

const MonthDropdown = ({ month, incomes, onAdd, onDelete, onEdit }: {
  month: string;
  incomes: Income[];
  onAdd: (month: string, amount: number, notes: string, link: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, amount: number, notes: string, link: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const monthIncomes = incomes.filter((inc) => inc.month === month);
  const monthlyTotal = monthIncomes.reduce((sum, inc) => sum + (Number(inc.amount) || 0), 0);

  const handleAction = () => {
    if (!amount) return;
    if (editingId) {
      onEdit(editingId, Number(amount), desc, link);
      setEditingId(null);
    } else {
      onAdd(month, Number(amount), desc, link);
    }
    setAmount(''); setDesc(''); setLink('');
  };

  const startEdit = (inc: Income) => {
    setEditingId(inc.id);
    setAmount(inc.amount.toString());
    setDesc(inc.notes);
    setLink(inc.link || '');
    setIsOpen(true);
  };

  return (
    <div style={{ marginBottom: '15px', padding: '15px', border: '2px solid #F472B6', borderRadius: '20px', backgroundColor: 'white' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', alignItems: 'center' }}>
        <b style={{ color: '#F472B6', fontSize: '1.1rem' }}>{month}</b>
        <span style={{ color: '#F472B6', fontWeight: 'bold' }}>₱{monthlyTotal.toLocaleString()} {isOpen ? '▴' : '▾'}</span>
      </div>

      {isOpen && (
        <div style={{ marginTop: '15px', borderTop: '1px dashed #FBCFE8', paddingTop: '10px' }}>
          {monthIncomes.map((inc) => (
            <div key={inc.id} style={{ fontSize: '0.8rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span>₱{inc.amount.toLocaleString()} - {inc.notes}</span>
              <div>
                <button onClick={() => startEdit(inc)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '5px' }}>✏️</button>
                <button onClick={() => onDelete(inc.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '5px', marginBottom: '8px', marginTop: '10px' }}>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (₱)" style={{ width: '30%', borderRadius: '10px', border: '1px solid #FBCFE8', padding: '8px' }} />
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="description" style={{ flex: 1, borderRadius: '10px', border: '1px solid #FBCFE8', padding: '8px' }} />
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="paste link here" style={{ flex: 1, borderRadius: '10px', border: '1px solid #FBCFE8', padding: '8px' }} />
            <button onClick={handleAction} style={{ backgroundColor: '#F472B6', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 15px', cursor: 'pointer' }}>
              {editingId ? 'Save' : '+ Add'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const { incomes, addIncome, deleteIncome, editIncome, q1Tax, q2Tax, q3Tax, q4Tax, totalGross } = useTaxCalculator();
  const [taxLinks, setTaxLinks] = useState<Record<Quarter, string>>({ q1: '', q2: '', q3: '', q4: '' });
  const [goal, setGoal] = useState(500000); // Default annual goal

  const handlePasteLink = (quarter: Quarter) => {
    const url = prompt(`Paste your BIR certificate link for ${quarter.toUpperCase()}:`);
    if (url) setTaxLinks((prev) => ({ ...prev, [quarter]: url }));
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

      {/* Progress Section */}
      <ProgressBar current={totalGross} goal={goal} />
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} placeholder="Set Annual Goal" style={{ padding: '5px', borderRadius: '10px', border: '1px solid #FBCFE8', textAlign: 'center' }} />
      </div>

      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', border: '2px solid #F472B6', marginBottom: '30px' }}>
          <h2 style={{ color: '#F472B6', fontSize: '1.1rem', marginTop: 0 }}>Quarterly Tax Due</h2>
          {quarters.map((q) => (
            <div key={q.key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>{q.name.split(':')[0]}: <b>₱{q.tax.toLocaleString()}</b></span>
              <button onClick={() => handlePasteLink(q.key)} style={{ cursor: 'pointer', color: taxLinks[q.key] ? '#065F46' : '#F472B6', textDecoration: 'underline', background: 'none', border: 'none', fontSize: '0.9rem' }}>
                {taxLinks[q.key] ? 'View Link ✅' : 'Paste Link'}
              </button>
            </div>
          ))}
        </div>

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