import Head from 'next/head';
import { useState } from 'react';
import useTaxCalculator, { Income } from '../hooks/usetaxcalculator';

const MonthDropdown = ({ month, incomes, onAdd, onDelete, onEdit }: { month: string, incomes: Income[], onAdd: (m: string, a: number, n: string, l: string) => void, onDelete: (id: number) => void, onEdit: (id: number, a: number, n: string, l: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [linkInput, setLinkInput] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editLink, setEditLink] = useState('');

  const monthIncomes = incomes.filter(i => i.month === month);
  const monthTotal = monthIncomes.reduce((sum, i) => sum + i.amount, 0);

  const handleAdd = () => {
    if (Number(amountInput) > 0) {
      onAdd(month, Number(amountInput), notesInput, linkInput);
      setAmountInput('');
      setNotesInput('');
      setLinkInput('');
    }
  };

  const startEditing = (inc: Income) => {
    setEditingId(inc.id);
    setEditAmount(inc.amount.toString());
    setEditNotes(inc.notes);
    setEditLink(inc.link);
  };

  const saveEdit = (id: number) => {
    onEdit(id, Number(editAmount), editNotes, editLink);
    setEditingId(null);
  };

  return (
    <div style={{ marginBottom: '10px', border: '2px solid #FBCFE8', borderRadius: '15px', overflow: 'hidden', backgroundColor: 'white' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: isOpen ? '#FFF5F7' : 'white' }}>
        <b style={{ color: '#F472B6', fontSize: '1rem' }}>{month}</b>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#888', fontSize: '0.9rem', fontWeight: 'bold' }}>₱{monthTotal.toLocaleString()}</span>
          <span style={{ color: '#F472B6', fontSize: '0.8rem' }}>{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>

      {isOpen && (
        <div style={{ padding: '15px', borderTop: '2px solid #FBCFE8', backgroundColor: '#fafafa' }}>
          {monthIncomes.map(inc => (
            <div key={inc.id} style={{ display: 'flex', flexDirection: 'column', padding: '10px 0', borderBottom: '1px dashed #ddd' }}>
              {editingId === inc.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} style={{ width: '100px', padding: '6px', borderRadius: '6px', border: '1px solid #FBCFE8', outline: 'none' }} />
                    <input type="text" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #FBCFE8', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={editLink} onChange={(e) => setEditLink(e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #FBCFE8', outline: 'none' }} />
                    <button onClick={() => saveEdit(inc.id)} style={{ padding: '6px 12px', backgroundColor: '#34D399', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ padding: '6px 12px', backgroundColor: '#ccc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#555', fontWeight: 'bold', fontSize: '0.9rem' }}>{inc.notes || 'Income'}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <b style={{ color: '#888', marginRight: '5px' }}>₱{inc.amount.toLocaleString()}</b>
                      <button onClick={() => startEditing(inc)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }} title="Edit">✏️</button>
                      <button onClick={() => onDelete(inc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }} title="Delete">🗑️</button>
                    </div>
                  </div>
                  {inc.link && (
                    <a href={inc.link.startsWith('http') ? inc.link : `https://${inc.link}`} target="_blank" rel="noreferrer" style={{ color: '#F472B6', fontSize: '0.8rem', textDecoration: 'none', marginTop: '4px', display: 'inline-block' }}>🔗 View Attached Link</a>
                  )}
                </>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} placeholder="Amount (₱)" style={{ width: '100px', padding: '8px', borderRadius: '8px', border: '1px solid #FBCFE8', outline: 'none', color: '#555' }} />
              <input type="text" value={notesInput} onChange={(e) => setNotesInput(e.target.value)} placeholder="use description" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #FBCFE8', outline: 'none', color: '#555' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} placeholder="use paste link" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #FBCFE8', outline: 'none', color: '#555' }} />
              <button onClick={handleAdd} style={{ padding: '8px 15px', backgroundColor: '#F472B6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const { incomes, addIncome, deleteIncome, editIncome, q1, q2, q3, q4, q1Tax, q2Tax, q3Tax, q4Tax, totalGross } = useTaxCalculator();

  return (
    <div style={{ padding: '40px', fontFamily: '"Mali", sans-serif', backgroundColor: '#FFF5F7', minHeight: '100vh' }}>
      <Head>
        <title>Pink Whale Planner</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F472B6" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Mali:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* The Global Font Fix for the boxes and buttons! */}
      <style>{`
        * {
          font-family: 'Mali', sans-serif !important;
        }
      `}</style>

      <h1 style={{ color: '#F472B6', textAlign: 'center', marginBottom: '40px' }}>
        My Financial Planner 🐳
      </h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h3 style={{ color: '#F472B6', borderBottom: '2px dashed #FBCFE8', paddingBottom: '10px' }}>Q1: Jan - Mar</h3>
          {['January', 'February', 'March'].map(m => <MonthDropdown key={m} month={m} incomes={incomes} onAdd={addIncome} onDelete={deleteIncome} onEdit={editIncome} />)}

          <h3 style={{ color: '#F472B6', borderBottom: '2px dashed #FBCFE8', paddingBottom: '10px', marginTop: '30px' }}>Q2: Apr - Jun</h3>
          {['April', 'May', 'June'].map(m => <MonthDropdown key={m} month={m} incomes={incomes} onAdd={addIncome} onDelete={deleteIncome} onEdit={editIncome} />)}

          <h3 style={{ color: '#F472B6', borderBottom: '2px dashed #FBCFE8', paddingBottom: '10px', marginTop: '30px' }}>Q3: Jul - Sep</h3>
          {['July', 'August', 'September'].map(m => <MonthDropdown key={m} month={m} incomes={incomes} onAdd={addIncome} onDelete={deleteIncome} onEdit={editIncome} />)}

          <h3 style={{ color: '#F472B6', borderBottom: '2px dashed #FBCFE8', paddingBottom: '10px', marginTop: '30px' }}>Q4: Oct - Dec</h3>
          {['October', 'November', 'December'].map(m => <MonthDropdown key={m} month={m} incomes={incomes} onAdd={addIncome} onDelete={deleteIncome} onEdit={editIncome} />)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '40px' }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center', width: '220px' }}>
            <img src="/income.svg" alt="Income" style={{ width: '80px', height: '80px', marginBottom: '10px' }} />
            <h2 style={{ color: '#F472B6', margin: 0, fontSize: '1.1rem' }}>Total Year Income</h2>
            <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '1.2rem', fontWeight: 'bold' }}>₱{totalGross.toLocaleString()}</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center', width: '220px' }}>
            <img src="/tax.svg" alt="Tax" style={{ width: '80px', height: '80px', marginBottom: '10px' }} />
            <h2 style={{ color: '#F472B6', margin: 0, fontSize: '1.1rem' }}>Quarterly Tax Due</h2>
            <div style={{ textAlign: 'left', marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Q1:</span> <b>₱{q1Tax.toLocaleString()}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Q2:</span> <b>₱{q2Tax.toLocaleString()}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Q3:</span> <b>₱{q3Tax.toLocaleString()}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px dashed #FBCFE8' }}><span>Q4:</span> <b>₱{q4Tax.toLocaleString()}</b></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}