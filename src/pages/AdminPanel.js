import React, { useState } from 'react';

const MOCK_USERS = [
  { id:1, name:'Rahul Sharma', phone:'9876543210', email:'rahul@gmail.com', balance:15420, status:'active', joined:'2024-01-15', txns:23 },
  { id:2, name:'Priya Patel', phone:'9765432109', email:'priya@gmail.com', balance:8750, status:'active', joined:'2024-02-20', txns:15 },
  { id:3, name:'Amit Kumar', phone:'9654321098', email:'amit@gmail.com', balance:2300, status:'suspended', joined:'2024-03-10', txns:7 },
  { id:4, name:'Sneha Mehta', phone:'9543210987', email:'sneha@gmail.com', balance:45000, status:'active', joined:'2024-01-05', txns:89 },
  { id:5, name:'Vijay Singh', phone:'9432109876', email:'vijay@gmail.com', balance:0, status:'inactive', joined:'2024-04-01', txns:2 },
];

const MOCK_TXN = [
  { id:'TXN001', from:'Rahul Sharma', to:'Priya Patel', amount:500, type:'transfer', status:'success', date:'2024-05-22 14:32' },
  { id:'TXN002', from:'Sneha Mehta', to:'Wallet', amount:2000, type:'deposit', status:'success', date:'2024-05-22 13:10' },
  { id:'TXN003', from:'Amit Kumar', to:'Rahul Sharma', amount:1200, type:'transfer', status:'failed', date:'2024-05-22 11:55' },
  { id:'TXN004', from:'Priya Patel', to:'Bank', amount:3500, type:'withdrawal', status:'pending', date:'2024-05-22 10:20' },
  { id:'TXN005', from:'Vijay Singh', to:'Sneha Mehta', amount:800, type:'transfer', status:'success', date:'2024-05-21 18:45' },
  { id:'TXN006', from:'Sneha Mehta', to:'Amit Kumar', amount:150, type:'transfer', status:'success', date:'2024-05-21 15:30' },
];

const NAV = [
  { id:'overview', icon:'📊', label:'Overview' },
  { id:'users', icon:'👥', label:'Users' },
  { id:'transactions', icon:'💳', label:'Transactions' },
  { id:'settings', icon:'⚙️', label:'Settings' },
];

export default function AdminPanel({ user, onLogout }) {
  const [tab, setTab] = useState('overview');
  const [sideOpen, setSideOpen] = useState(true);
  const [userFilter, setUserFilter] = useState('');
  const [txnFilter, setTxnFilter] = useState('all');
  const [users, setUsers] = useState(MOCK_USERS);
  const [notification, setNotification] = useState('');
  const [settings, setSettings] = useState({ siteName:'UltraPay', maintenanceMode:false, maxTransfer:50000, supportEmail:'support@ultrapay.com' });

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(''), 3000); };

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    notify('User status updated');
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalBalance: users.reduce((a, u) => a + u.balance, 0),
    totalTxns: MOCK_TXN.length,
    successTxns: MOCK_TXN.filter(t => t.status === 'success').length,
    pendingTxns: MOCK_TXN.filter(t => t.status === 'pending').length,
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userFilter.toLowerCase()) ||
    u.phone.includes(userFilter)
  );

  const filteredTxns = txnFilter === 'all' ? MOCK_TXN : MOCK_TXN.filter(t => t.status === txnFilter);

  return (
    <div style={styles.shell}>
      {/* Notification */}
      {notification && (
        <div style={styles.notif}>{notification}</div>
      )}

      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sideOpen ? 220 : 60 }}>
        <div style={styles.sideTop}>
          <div style={styles.logoRow}>
            <span style={styles.logoEmoji}>⚡</span>
            {sideOpen && <span style={styles.logoText}>UltraPay</span>}
          </div>
          <button style={styles.toggleBtn} onClick={() => setSideOpen(o => !o)}>{sideOpen ? '◀' : '▶'}</button>
        </div>

        <nav style={styles.nav}>
          {NAV.map(n => (
            <button key={n.id} style={{ ...styles.navBtn, ...(tab === n.id ? styles.navActive : {}) }} onClick={() => setTab(n.id)}>
              <span style={{fontSize:'1.1rem'}}>{n.icon}</span>
              {sideOpen && <span style={styles.navLabel}>{n.label}</span>}
            </button>
          ))}
        </nav>

        <div style={styles.sideBottom}>
          <div style={styles.adminInfo}>
            <div style={styles.adminAvatar}>A</div>
            {sideOpen && (
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:'0.85rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name}</div>
                <div style={{fontSize:'0.72rem',color:'#00c896'}}>Admin</div>
              </div>
            )}
          </div>
          <button style={styles.logoutBtn} onClick={onLogout}>
            {sideOpen ? '🚪 Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>{NAV.find(n => n.id === tab)?.label}</h1>
            <p style={styles.pageSub}>Welcome back, {user.name}</p>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <div style={styles.statusDot}>🟢 Live</div>
          </div>
        </header>

        <div style={styles.content}>
          {tab === 'overview' && <OverviewTab stats={stats} txns={MOCK_TXN} />}
          {tab === 'users' && <UsersTab users={filteredUsers} filter={userFilter} setFilter={setUserFilter} onToggle={toggleStatus} onNotify={notify} />}
          {tab === 'transactions' && <TxnsTab txns={filteredTxns} filter={txnFilter} setFilter={setTxnFilter} />}
          {tab === 'settings' && <SettingsTab settings={settings} setSettings={setSettings} onNotify={notify} />}
        </div>
      </main>
    </div>
  );
}

function OverviewTab({ stats, txns }) {
  const cards = [
    { label:'Total Users', value:stats.totalUsers, icon:'👥', color:'#4a90e2' },
    { label:'Active Users', value:stats.activeUsers, icon:'✅', color:'#00c896' },
    { label:'Total Balance', value:'₹'+stats.totalBalance.toLocaleString(), icon:'💰', color:'#f5a623' },
    { label:'Total Transactions', value:stats.totalTxns, icon:'💳', color:'#a855f7' },
    { label:'Success Txns', value:stats.successTxns, icon:'✔️', color:'#00c896' },
    { label:'Pending Txns', value:stats.pendingTxns, icon:'⏳', color:'#f5a623' },
  ];

  return (
    <div>
      <div style={styles.statGrid}>
        {cards.map((c,i) => (
          <div key={i} style={styles.statCard}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <p style={styles.statLabel}>{c.label}</p>
                <p style={{...styles.statVal,color:c.color}}>{c.value}</p>
              </div>
              <span style={{fontSize:'1.8rem'}}>{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 style={styles.sectionTitle}>Recent Transactions</h2>
      <TxnTable txns={txns.slice(0,5)} />
    </div>
  );
}

function UsersTab({ users, filter, setFilter, onToggle, onNotify }) {
  return (
    <div>
      <div style={{display:'flex',gap:12,marginBottom:20,alignItems:'center',flexWrap:'wrap'}}>
        <input className="input-field" style={{maxWidth:280}} placeholder="Search by name or phone..." value={filter} onChange={e => setFilter(e.target.value)} />
        <span style={{color:'#7a8599',fontSize:'0.85rem'}}>{users.length} users found</span>
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Name','Phone','Balance','Status','Joined','Txns','Action'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{...styles.avatar,background: u.status==='active'?'rgba(0,200,150,0.2)':'rgba(255,77,106,0.2)',color:u.status==='active'?'#00c896':'#ff4d6a'}}>{u.name[0]}</div>
                    <div>
                      <div style={{fontWeight:500,fontSize:'0.9rem'}}>{u.name}</div>
                      <div style={{fontSize:'0.75rem',color:'#7a8599'}}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>{u.phone}</td>
                <td style={{...styles.td,color:'#00c896',fontWeight:600,fontFamily:'Space Mono,monospace'}}>₹{u.balance.toLocaleString()}</td>
                <td style={styles.td}><span style={{...styles.pill, background:u.status==='active'?'rgba(0,200,150,0.15)':u.status==='suspended'?'rgba(255,77,106,0.15)':'rgba(122,133,153,0.15)', color:u.status==='active'?'#00c896':u.status==='suspended'?'#ff4d6a':'#7a8599'}}>{u.status}</span></td>
                <td style={{...styles.td,color:'#7a8599',fontSize:'0.82rem'}}>{u.joined}</td>
                <td style={styles.td}>{u.txns}</td>
                <td style={styles.td}>
                  <button style={{...styles.actionBtn,background:u.status==='active'?'rgba(255,77,106,0.15)':'rgba(0,200,150,0.15)',color:u.status==='active'?'#ff4d6a':'#00c896'}} onClick={() => onToggle(u.id)}>
                    {u.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TxnsTab({ txns, filter, setFilter }) {
  return (
    <div>
      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
        {['all','success','pending','failed'].map(f => (
          <button key={f} style={{...styles.filterBtn, ...(filter===f?styles.filterActive:{})}} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>
      <TxnTable txns={txns} />
    </div>
  );
}

function TxnTable({ txns }) {
  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            {['TXN ID','From','To','Amount','Type','Status','Date'].map(h => <th key={h} style={styles.th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {txns.map(t => (
            <tr key={t.id} style={styles.tr}>
              <td style={{...styles.td,fontFamily:'Space Mono,monospace',fontSize:'0.8rem',color:'#4a90e2'}}>{t.id}</td>
              <td style={styles.td}>{t.from}</td>
              <td style={styles.td}>{t.to}</td>
              <td style={{...styles.td,color:'#00c896',fontWeight:600,fontFamily:'Space Mono,monospace'}}>₹{t.amount.toLocaleString()}</td>
              <td style={styles.td}><span style={{...styles.pill,background:'rgba(74,144,226,0.15)',color:'#4a90e2'}}>{t.type}</span></td>
              <td style={styles.td}>
                <span style={{...styles.pill,
                  background:t.status==='success'?'rgba(0,200,150,0.15)':t.status==='failed'?'rgba(255,77,106,0.15)':'rgba(245,166,35,0.15)',
                  color:t.status==='success'?'#00c896':t.status==='failed'?'#ff4d6a':'#f5a623'
                }}>{t.status}</span>
              </td>
              <td style={{...styles.td,color:'#7a8599',fontSize:'0.82rem'}}>{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SettingsTab({ settings, setSettings, onNotify }) {
  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));
  return (
    <div style={{maxWidth:560}}>
      <div className="card" style={{marginBottom:20}}>
        <h3 style={{fontWeight:600,marginBottom:20}}>General Settings</h3>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label style={{fontSize:'0.85rem',color:'#a0aabe'}}>Site Name</label>
            <input className="input-field" value={settings.siteName} onChange={e => set('siteName', e.target.value)} />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label style={{fontSize:'0.85rem',color:'#a0aabe'}}>Support Email</label>
            <input className="input-field" type="email" value={settings.supportEmail} onChange={e => set('supportEmail', e.target.value)} />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label style={{fontSize:'0.85rem',color:'#a0aabe'}}>Max Transfer Limit (₹)</label>
            <input className="input-field" type="number" value={settings.maxTransfer} onChange={e => set('maxTransfer', +e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom:20}}>
        <h3 style={{fontWeight:600,marginBottom:16}}>Maintenance Mode</h3>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <p style={{fontSize:'0.9rem'}}>Put site in maintenance mode</p>
            <p style={{fontSize:'0.8rem',color:'#7a8599',marginTop:4}}>Users won't be able to log in or transact</p>
          </div>
          <div style={{...styles.toggle, background: settings.maintenanceMode ? '#ff4d6a' : '#1a2236'}} onClick={() => set('maintenanceMode', !settings.maintenanceMode)}>
            <div style={{...styles.toggleKnob, transform: settings.maintenanceMode ? 'translateX(24px)' : 'translateX(0)'}}></div>
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={() => onNotify('✅ Settings saved successfully!')}>
        Save Settings
      </button>
    </div>
  );
}

const styles = {
  shell: { display:'flex', minHeight:'100vh', background:'#0a0f1e', fontFamily:'DM Sans,sans-serif' },
  sidebar: { background:'#0e1528', borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', transition:'width 0.3s', overflow:'hidden', flexShrink:0 },
  sideTop: { padding:'16px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.07)' },
  logoRow: { display:'flex', alignItems:'center', gap:10 },
  logoEmoji: { fontSize:'1.4rem', width:36, height:36, background:'#00c896', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  logoText: { fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'1rem', color:'#fff', whiteSpace:'nowrap' },
  toggleBtn: { background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#7a8599', cursor:'pointer', padding:'4px 8px', fontSize:'0.7rem', flexShrink:0 },
  nav: { flex:1, padding:'12px 8px', display:'flex', flexDirection:'column', gap:4 },
  navBtn: { display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10, border:'none', background:'none', color:'#a0aabe', cursor:'pointer', width:'100%', textAlign:'left', transition:'all 0.2s', whiteSpace:'nowrap' },
  navActive: { background:'rgba(0,200,150,0.12)', color:'#00c896' },
  navLabel: { fontWeight:500, fontSize:'0.88rem' },
  sideBottom: { padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.07)' },
  adminInfo: { display:'flex', alignItems:'center', gap:10, padding:'8px', marginBottom:8, borderRadius:10, background:'rgba(255,255,255,0.03)' },
  adminAvatar: { width:32, height:32, background:'rgba(0,200,150,0.2)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#00c896', fontWeight:700, flexShrink:0 },
  logoutBtn: { width:'100%', background:'rgba(255,77,106,0.1)', border:'1px solid rgba(255,77,106,0.2)', color:'#ff4d6a', borderRadius:8, padding:'8px 12px', cursor:'pointer', fontSize:'0.82rem', textAlign:'left' },
  main: { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 28px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(14,21,40,0.8)' },
  pageTitle: { fontSize:'1.4rem', fontWeight:700 },
  pageSub: { color:'#7a8599', fontSize:'0.82rem', marginTop:2 },
  statusDot: { fontSize:'0.82rem', color:'#00c896', background:'rgba(0,200,150,0.1)', padding:'6px 12px', borderRadius:20, border:'1px solid rgba(0,200,150,0.2)' },
  content: { flex:1, overflow:'auto', padding:'24px 28px' },
  statGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:16, marginBottom:28 },
  statCard: { background:'#131929', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px' },
  statLabel: { color:'#7a8599', fontSize:'0.8rem', marginBottom:6 },
  statVal: { fontSize:'1.6rem', fontWeight:700, fontFamily:'Space Mono,monospace' },
  sectionTitle: { fontWeight:600, fontSize:'1rem', marginBottom:14, color:'#a0aabe' },
  tableWrap: { overflowX:'auto', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)' },
  table: { width:'100%', borderCollapse:'collapse', background:'#131929', borderRadius:14 },
  th: { padding:'12px 16px', textAlign:'left', fontSize:'0.75rem', color:'#7a8599', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:'1px solid rgba(255,255,255,0.07)', whiteSpace:'nowrap' },
  tr: { borderBottom:'1px solid rgba(255,255,255,0.04)', transition:'background 0.15s' },
  td: { padding:'13px 16px', fontSize:'0.88rem', whiteSpace:'nowrap' },
  avatar: { width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.85rem' },
  pill: { padding:'3px 10px', borderRadius:20, fontSize:'0.75rem', fontWeight:600 },
  actionBtn: { padding:'5px 12px', borderRadius:7, border:'none', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 },
  filterBtn: { padding:'7px 16px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'#a0aabe', cursor:'pointer', fontSize:'0.85rem' },
  filterActive: { background:'rgba(0,200,150,0.15)', borderColor:'rgba(0,200,150,0.3)', color:'#00c896' },
  toggle: { width:48, height:26, borderRadius:13, cursor:'pointer', position:'relative', transition:'background 0.3s', flexShrink:0 },
  toggleKnob: { position:'absolute', top:3, left:3, width:20, height:20, background:'#fff', borderRadius:10, transition:'transform 0.3s' },
  notif: { position:'fixed', top:20, right:20, background:'#00c896', color:'#000', padding:'12px 20px', borderRadius:10, fontWeight:600, zIndex:9999, fontSize:'0.88rem', boxShadow:'0 4px 20px rgba(0,200,150,0.4)' },
};
             
