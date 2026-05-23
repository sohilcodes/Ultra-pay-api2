import React, { useState } from 'react';

const MY_TXNS = [
  { id:'TXN001', desc:'Received from Sneha', amount:+500, type:'credit', date:'Today 14:32', status:'success' },
  { id:'TXN002', desc:'Sent to Priya Patel', amount:-1200, type:'debit', date:'Today 11:20', status:'success' },
  { id:'TXN003', desc:'Wallet Top-up', amount:+2000, type:'credit', date:'Yesterday 09:15', status:'success' },
  { id:'TXN004', desc:'Bank Withdrawal', amount:-3500, type:'debit', date:'22 May 18:45', status:'pending' },
];

export default function UserDashboard({ user, onLogout }) {
  const [tab, setTab] = useState('home');
  const [sendForm, setSendForm] = useState({ phone:'', amount:'', note:'' });
  const [sendStep, setSendStep] = useState(1);
  const [notification, setNotification] = useState('');

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(''), 3000); };
  const balance = user.balance || 12450;

  const handleSend = (e) => {
    e.preventDefault();
    if (sendStep === 1) { setSendStep(2); return; }
    notify('✅ ₹'+sendForm.amount+' sent successfully!');
    setSendForm({ phone:'', amount:'', note:'' });
    setSendStep(1);
    setTab('home');
  };

  return (
    <div style={styles.page}>
      {notification && <div style={styles.notif}>{notification}</div>}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoEmoji}>⚡</span>
          <span style={styles.logoText}>UltraPay</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:'0.85rem',color:'#7a8599'}}>Hi, {user.name.split(' ')[0]}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div style={styles.body}>
        {/* Balance Card */}
        <div style={styles.balCard}>
          <div style={styles.balBg}></div>
          <p style={styles.balLabel}>Total Balance</p>
          <p style={styles.balAmount}>₹{balance.toLocaleString()}</p>
          <div style={styles.balRow}>
            <span style={{fontSize:'0.8rem',opacity:0.7}}>🔒 Secured Account</span>
            <span style={{fontSize:'0.8rem',background:'rgba(255,255,255,0.15)',padding:'3px 10px',borderRadius:20}}>Active</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickGrid}>
          {[
            { icon:'💸', label:'Send Money', action:() => setTab('send') },
            { icon:'📥', label:'Add Money', action:() => notify('Add money feature coming soon!') },
            { icon:'🏦', label:'Withdraw', action:() => notify('Withdrawal feature coming soon!') },
            { icon:'📄', label:'Statement', action:() => setTab('txns') },
          ].map((q,i) => (
            <button key={i} style={styles.quickBtn} onClick={q.action}>
              <span style={{fontSize:'1.5rem'}}>{q.icon}</span>
              <span style={styles.quickLabel}>{q.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabs}>
          {['home','send','txns'].map(t => (
            <button key={t} style={{...styles.tabBtn,...(tab===t?styles.tabActive:{})}} onClick={() => setTab(t)}>
              {t === 'home' ? '🏠 Home' : t === 'send' ? '💸 Send' : '📋 Transactions'}
            </button>
          ))}
        </div>

        {tab === 'home' && (
          <div>
            <h3 style={styles.sectionTitle}>Recent Transactions</h3>
            {MY_TXNS.map(t => (
              <div key={t.id} style={styles.txnRow}>
                <div style={{...styles.txnIcon, background: t.type==='credit'?'rgba(0,200,150,0.15)':'rgba(255,77,106,0.15)'}}>
                  {t.type === 'credit' ? '↓' : '↑'}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontWeight:500,fontSize:'0.9rem'}}>{t.desc}</p>
                  <p style={{color:'#7a8599',fontSize:'0.78rem',marginTop:2}}>{t.date}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{fontWeight:700,fontFamily:'Space Mono,monospace',color:t.type==='credit'?'#00c896':'#ff4d6a'}}>{t.type==='credit'?'+':''}{t.amount < 0 ? '-' : ''}₹{Math.abs(t.amount).toLocaleString()}</p>
                  <p style={{fontSize:'0.72rem',color:t.status==='pending'?'#f5a623':'#7a8599',marginTop:2}}>{t.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'send' && (
          <div style={styles.sendCard}>
            <h3 style={{fontWeight:700,fontSize:'1.1rem',marginBottom:20}}>
              {sendStep === 1 ? '💸 Send Money' : '✅ Confirm Transfer'}
            </h3>
            {sendStep === 1 ? (
              <form onSubmit={handleSend} style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={styles.field}>
                  <label style={styles.label}>Recipient Phone</label>
                  <input className="input-field" type="tel" placeholder="10-digit phone number" value={sendForm.phone} onChange={e => setSendForm(f=>({...f,phone:e.target.value.replace(/\D/g,'').slice(0,10)}))} required />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Amount (₹)</label>
                  <input className="input-field" type="number" placeholder="Enter amount" value={sendForm.amount} onChange={e => setSendForm(f=>({...f,amount:e.target.value}))} required min="1" max={balance} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Note (optional)</label>
                  <input className="input-field" placeholder="What's it for?" value={sendForm.note} onChange={e => setSendForm(f=>({...f,note:e.target.value}))} />
                </div>
                <button className="btn-primary" type="submit" style={{marginTop:4}}>Review Transfer</button>
              </form>
            ) : (
              <div>
                <div style={styles.confirmBox}>
                  <div style={styles.confirmRow}><span style={{color:'#7a8599'}}>To</span><span>{sendForm.phone}</span></div>
                  <div style={styles.confirmRow}><span style={{color:'#7a8599'}}>Amount</span><span style={{color:'#00c896',fontWeight:700,fontFamily:'Space Mono,monospace'}}>₹{(+sendForm.amount).toLocaleString()}</span></div>
                  {sendForm.note && <div style={styles.confirmRow}><span style={{color:'#7a8599'}}>Note</span><span>{sendForm.note}</span></div>}
                  <div style={styles.confirmRow}><span style={{color:'#7a8599'}}>Balance after</span><span>₹{(balance - +sendForm.amount).toLocaleString()}</span></div>
                </div>
                <div style={{display:'flex',gap:10,marginTop:20}}>
                  <button style={styles.cancelBtn} onClick={() => setSendStep(1)}>← Edit</button>
                  <button className="btn-primary" style={{flex:1}} onClick={handleSend}>Confirm & Send</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'txns' && (
          <div>
            <h3 style={styles.sectionTitle}>All Transactions</h3>
            {MY_TXNS.map(t => (
              <div key={t.id} style={styles.txnRow}>
                <div style={{...styles.txnIcon,background:t.type==='credit'?'rgba(0,200,150,0.15)':'rgba(255,77,106,0.15)'}}>
                  {t.type === 'credit' ? '↓' : '↑'}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontWeight:500,fontSize:'0.9rem'}}>{t.desc}</p>
                  <p style={{color:'#7a8599',fontSize:'0.78rem',marginTop:2}}>{t.id} · {t.date}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{fontWeight:700,fontFamily:'Space Mono,monospace',color:t.type==='credit'?'#00c896':'#ff4d6a'}}>{t.type==='credit'?'+':'-'}₹{Math.abs(t.amount).toLocaleString()}</p>
                  <span style={{fontSize:'0.72rem',padding:'2px 8px',borderRadius:20,background:t.status==='pending'?'rgba(245,166,35,0.15)':'rgba(0,200,150,0.1)',color:t.status==='pending'?'#f5a623':'#00c896'}}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight:'100vh', background:'#0a0f1e', color:'#e8edf5', fontFamily:'DM Sans,sans-serif' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'#0e1528', position:'sticky', top:0, zIndex:10 },
  logo: { display:'flex', alignItems:'center', gap:8 },
  logoEmoji: { width:32, height:32, background:'#00c896', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' },
  logoText: { fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'1rem' },
  logoutBtn: { background:'rgba(255,77,106,0.1)', border:'1px solid rgba(255,77,106,0.2)', color:'#ff4d6a', borderRadius:8, padding:'6px 14px', cursor:'pointer', fontSize:'0.82rem' },
  body: { maxWidth:480, margin:'0 auto', padding:'20px 16px' },
  balCard: { background:'linear-gradient(135deg,#006650,#003d2e)', borderRadius:20, padding:'28px 24px', marginBottom:20, position:'relative', overflow:'hidden' },
  balBg: { position:'absolute', top:-40, right:-40, width:160, height:160, background:'rgba(255,255,255,0.05)', borderRadius:'50%' },
  balLabel: { fontSize:'0.85rem', opacity:0.7, marginBottom:6, position:'relative' },
  balAmount: { fontSize:'2.2rem', fontWeight:700, fontFamily:'Space Mono,monospace', marginBottom:16, position:'relative' },
  balRow: { display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative' },
  quickGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 },
  quickBtn: { background:'#131929', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'14px 8px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, cursor:'pointer', transition:'all 0.2s' },
  quickLabel: { fontSize:'0.72rem', color:'#a0aabe', fontWeight:500 },
  tabs: { display:'flex', gap:8, marginBottom:20, background:'#0e1528', borderRadius:12, padding:6 },
  tabBtn: { flex:1, padding:'8px 4px', border:'none', borderRadius:8, background:'none', color:'#7a8599', cursor:'pointer', fontSize:'0.8rem', fontWeight:500, transition:'all 0.2s' },
  tabActive: { background:'#1a2236', color:'#00c896' },
  sectionTitle: { fontWeight:600, fontSize:'0.9rem', color:'#a0aabe', marginBottom:12 },
  txnRow: { display:'flex', alignItems:'center', gap:12, padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' },
  txnIcon: { width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'1.1rem', flexShrink:0 },
  sendCard: { background:'#131929', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'24px 20px' },
  field: { display:'flex', flexDirection:'column', gap:6 },
  label: { fontSize:'0.82rem', color:'#a0aabe', fontWeight:500 },
  confirmBox: { background:'#0e1528', borderRadius:12, padding:'16px', border:'1px solid rgba(255,255,255,0.07)' },
  confirmRow: { display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'0.9rem' },
  cancelBtn: { padding:'12px 20px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, background:'none', color:'#a0aabe', cursor:'pointer' },
  notif: { position:'fixed', top:20, right:20, background:'#00c896', color:'#000', padding:'12px 20px', borderRadius:10, fontWeight:600, zIndex:9999, fontSize:'0.88rem', boxShadow:'0 4px 20px rgba(0,200,150,0.4)' },
};
  
