import Head from 'next/head';

import { useState } from 'react';

// @ts-ignore

import useTaxCalculator, { Income } from '../hooks/usetaxcalculator';



type Quarter = 'q1' | 'q2' | 'q3' | 'q4';



const formatNumber = (val: string | number) => {

  const num = typeof val === 'string' ? val.replace(/,/g, '') : val;

  return num ? Number(num).toLocaleString() : '';

};



const ProgressBar = ({ current, goal }: { current: number; goal: number }) => {

  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (

    <div style={{ margin: '20px auto', maxWidth: '400px', padding: '15px', backgroundColor: 'white', borderRadius: '20px', border: '2px solid #FBCFE8', fontFamily: '"Mali", sans-serif' }}>

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



const MonthDropdown = ({ month, incomes, onAdd, onDelete, onEdit, selectedYear }: { 

  month: string, 

  incomes: Income[], 

  onAdd: (
  month: string,
  amount: number,
  notes: string,
  link: string
) => void,

  onDelete: (id: number) => void,

  onEdit: (id: number, amount: number, notes: string, link: string) => void,

  selectedYear: number

}) => {

  const [isOpen, setIsOpen] = useState(false);

  const [amount, setAmount] = useState('');

  const [notes, setNotes] = useState('');

  const [link, setLink] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);

  

const monthIncomes = incomes.filter(
  inc => inc.month === month
);

  const monthTotal = monthIncomes.reduce((sum, inc) => sum + Number(inc.amount), 0);



  const handleAction = () => {

    if (editingId) {

      onEdit(editingId, Number(amount), notes, link);

      setEditingId(null);

    } else {

      // Pass the selectedYear so the hook tags the entry correctly

      onAdd(month, Number(amount), notes, link);

    }

    setAmount(''); setNotes(''); setLink('');

  };



  const startEdit = (inc: Income) => {

    setEditingId(inc.id);

    setAmount(inc.amount.toString());

    setNotes(inc.notes);

    setLink(inc.link || '');

    setIsOpen(true);

  };



  return (

    <div style={{ marginBottom: '10px', border: '2px solid #FBCFE8', borderRadius: '15px', backgroundColor: 'white', padding: '10px', fontFamily: '"Mali", sans-serif' }}>

      <div onClick={() => setIsOpen(!isOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>

        <b style={{ color: '#F472B6', fontSize: '1rem' }}>{month}</b>

        <span style={{ color: '#F472B6', fontSize: '0.9rem' }}>₱{monthTotal.toLocaleString()} {isOpen ? '▲' : '▼'}</span>

      </div>

      {isOpen && (

        <div style={{ marginTop: '10px', borderTop: '1px dashed #FBCFE8', paddingTop: '10px' }}>

          {monthIncomes.map(inc => (

            <div key={inc.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '5px 0' }}>

              {inc.notes}: ₱{Number(inc.amount).toLocaleString()} 

              <div>

                <button onClick={() => startEdit(inc)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✏️</button>

                <button onClick={() => onDelete(inc.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button>

              </div>

            </div>

          ))}

          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>

            <div style={{ display: 'flex', gap: '5px' }}>

              <input type="text" placeholder="Amount" value={formatNumber(amount)} onChange={(e) => setAmount(e.target.value.replace(/,/g, ''))} style={{ width: '40%', padding: '5px', borderRadius: '5px', border: '1px solid #FBCFE8', fontFamily: '"Mali", sans-serif' }} />

              <input placeholder="description" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ flex: 1, padding: '5px', borderRadius: '5px', border: '1px solid #FBCFE8', fontFamily: '"Mali", sans-serif' }} />

            </div>

            <input placeholder="paste link here" value={link} onChange={(e) => setLink(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #FBCFE8', fontFamily: '"Mali", sans-serif' }} />

            <button onClick={handleAction} style={{ backgroundColor: '#F472B6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: '5px', fontFamily: '"Mali", sans-serif' }}>{editingId ? 'Save' : '+ Add'}</button>

          </div>

        </div>

      )}

    </div>

  );

};



export default function Home() {

  const [selectedYear, setSelectedYear] = useState(2026);

  // @ts-ignore

  const { incomes, addIncome, deleteIncome, editIncome, q1Tax, q2Tax, q3Tax, q4Tax, totalGross } = useTaxCalculator(selectedYear);

  

  const [birLinks, setBirLinks] = useState<Record<Quarter, string>>({ q1: '', q2: '', q3: '', q4: '' });

  const [expectedIncome, setExpectedIncome] = useState<string>('500,000');



  const quarters = [

    { name: 'Q1 (Jan-Mar)', months: ['January', 'February', 'March'], tax: q1Tax, key: 'q1' as Quarter },

    { name: 'Q2 (Apr-Jun)', months: ['April', 'May', 'June'], tax: q2Tax, key: 'q2' as Quarter },

    { name: 'Q3 (Jul-Sep)', months: ['July', 'August', 'September'], tax: q3Tax, key: 'q3' as Quarter },

    { name: 'Q4 (Oct-Dec)', months: ['October', 'November', 'December'], tax: q4Tax, key: 'q4' as Quarter },

  ];



  return (

    <div style={{ padding: '20px', fontFamily: '"Mali", sans-serif', backgroundColor: '#FFF5F7', minHeight: '100vh' }}>

      <Head>

        <link href="https://fonts.googleapis.com/css2?family=Mali:wght@400;700&display=swap" rel="stylesheet" />

      </Head>



      <div style={{ textAlign: 'center', marginBottom: '20px' }}>

        <img src="/savings2.svg" alt="Savings" style={{ width: '80px', border: 'none', outline: 'none', backgroundColor: 'transparent' }} />

        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} style={{ fontFamily: '"Mali", sans-serif', fontSize: '1.2rem', color: '#F472B6', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'block', margin: '0 auto' }}>

          {[2026, 2027, 2028].map(year => <option key={year} value={year}>{year}</option>)}

        </select>

        <h1 style={{ color: '#F472B6', margin: 0 }}>My Financial Planner 🐳</h1>

        <h2 style={{ color: '#F472B6', fontSize: '1.2rem' }}>Total Income: ₱{totalGross.toLocaleString()}</h2>

        

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}>

          <span style={{ color: '#F472B6', fontFamily: '"Mali", sans-serif' }}>Expected Income: ₱</span>

          <input type="text" value={formatNumber(expectedIncome)} onChange={(e) => setExpectedIncome(e.target.value.replace(/,/g, ''))} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #FBCFE8', width: '120px', fontFamily: '"Mali", sans-serif' }} />

        </div>

      </div>



      <ProgressBar current={totalGross} goal={Number(expectedIncome.replace(/,/g, '')) || 1} />



      <div style={{ maxWidth: '400px', margin: '0 auto' }}>

        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '20px', border: '2px solid #F472B6' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            <img src="/tax2.svg" alt="Tax" style={{ width: '40px', border: 'none', outline: 'none', backgroundColor: 'transparent' }} />

            <h2 style={{ color: '#F472B6', margin: 0 }}>Quarterly Tax Due</h2>

          </div>

     {quarters.map((q) => (
  <div
    key={q.key}
    style={{
      marginTop: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px'
    }}
  >
    <span style={{ color: '#F472B6' }}>
      {q.name}: <b>₱{q.tax.toLocaleString()}</b>
    </span>

    <input
      placeholder="paste link here"
      value=""
      onChange={(e) =>
        setBirLinks(prev => ({
          ...prev,
          [q.key]: e.target.value
        }))
      }
      style={{
        width: '120px',
        padding: '5px',
        borderRadius: '5px',
        border: '1px solid #FBCFE8'
      }}
    />
  </div>
))}
        </div>



     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
  <img
    src="/income2.svg"
    alt="Income"
    style={{
      width: '40px',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent'
    }}
  />

  <h3 style={{ color: '#F472B6', margin: 0 }}>
    Monthly Income
  </h3>
</div>

{quarters.map((q) => (
  <div key={q.key} style={{ marginBottom: '20px' }}>
    <h4
      style={{
        color: '#F472B6',
        marginBottom: '5px'
      }}
    >
      {q.name}
    </h4>

    {q.months.map((m) => (
      <MonthDropdown
        key={m}
        month={m}
        incomes={incomes}
        selectedYear={selectedYear}
        onAdd={(m, a, n, l) => addIncome(m, a, n, l)}
        onDelete={deleteIncome}
        onEdit={editIncome}
      />
    ))}
  </div>
))}

  </div>
      </div>

  );

}