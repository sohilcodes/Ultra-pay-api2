import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Demo users - replace with real API calls
const DEMO_USERS = [
  { phone: '9999999999', password: 'admin123', role: 'admin', name: 'Admin User' },
  { phone: '8888888888', password: 'user123', role: 'user', name: 'John Doe', balance: 12450 },
];

export default function LoginPage({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(phone)) { setError('Enter valid 10-digit number'); return; }
    if (password.length < 6) { setError('Password must be 6+ characters'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const found = DEMO_USERS.find(u => u.phone === phone && u.password === password);
    if (found) {
      onLogin(found);
    } else {
      setError('Invalid phone number or password');
    }
    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setResetSent(true);
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg}></div>
      <div style={styles.grid}></div>

      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>⚡</div>
          <span style={styles.logoText}>UltraPay</span>
        </div>

        {!showReset ? (
          <div style={styles.card}>
            <h1 style={styles.title}>Sign In</h1>
            <p style={styles.subtitle}>Enter your credentials to continue</p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Phone Number</label>
                <input
                  className="input-field"
                  type="tel"
                  placeholder="Enter a valid 10-digit number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                  maxLength={10}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="At least 6 characters required"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div style={styles.row}>
                <label style={styles.checkRow}>
                  <input type="checkbox" style={{accentColor:'#00c896'}} />
                  <span style={{marginLeft:8,fontSize:'0.85rem',color:'#7a8599'}}>Remember me</span>
                </label>
                <button type="button" style={styles.link} onClick={() => setShowReset(true)}>
                  Forgot password?
                </button>
              </div>

              <button className="btn-primary" type="submit" style={{width:'100%', padding:'14px', fontSize:'1rem'}} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={styles.divider}><span>or</span></div>
            <p style={styles.register}>
              No account? <Link to="/register" style={{color:'#00c896',fontWeight:600}}>Create one →</Link>
            </p>

            <div style={styles.badges}>
              <span style={styles.badge}>🟢 Systems Online</span>
              <span style={styles.badge}>🔒 SSL Secured</span>
              <span style={styles.badge}>🔐 256-bit Encrypted</span>
            </div>
            <p style={styles.secureNote}>Your connection is secure and encrypted</p>

            <div style={styles.demoBox}>
              <p style={{fontSize:'0.78rem',color:'#7a8599',marginBottom:4}}>🧪 Demo Credentials</p>
              <p style={{fontSize:'0.75rem',color:'#00c896'}}>Admin: 9999999999 / admin123</p>
              <p style={{fontSize:'0.75rem',color:'#4a90e2'}}>User: 8888888888 / user123</p>
            </div>
          </div>
        ) : (
          <div style={styles.card}>
            <button onClick={() => { setShowReset(false); setResetSent(false); }} style={styles.back}>← Back to Login</button>
            <h1 style={styles.title}>Reset Password</h1>
            {!resetSent ? (
              <form onSubmit={handleReset} style={styles.form}>
                <div style={styles.field}>
                  <label style={styles.label}>Phone Number</label>
                  <input className="input-field" type="tel" placeholder="Your phone number" value={resetPhone} onChange={e => setResetPhone(e.target.value)} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Email Address</label>
                  <input className="input-field" type="email" placeholder="Your email address" value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
                </div>
                <p style={{fontSize:'0.82rem',color:'#7a8599',marginBottom:8}}>A password reset link will be sent to your registered email and phone number.</p>
                <button className="btn-primary" type="submit" style={{width:'100%'}} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            ) : (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:'3rem',marginBottom:12}}>✅</div>
                <p style={{color:'#00c896',fontWeight:600}}>Reset link sent!</p>
                <p style={{color:'#7a8599',fontSize:'0.85rem',marginTop:8}}>Check your phone and email for the reset link.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', background:'#0a0f1e' },
  bg: { position:'absolute', inset:0, background:'radial-gradient(ellipse at 20% 50%, rgba(0,200,150,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(74,144,226,0.06) 0%, transparent 50%)', pointerEvents:'none' },
  grid: { position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize:'50px 50px', pointerEvents:'none' },
  container: { position:'relative', zIndex:1, width:'100%', maxWidth:420, padding:'20px 16px' },
  logo: { display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:28 },
  logoIcon: { width:40, height:40, background:'#00c896', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' },
  logoText: { fontFamily:'Space Mono,monospace', fontSize:'1.4rem', fontWeight:700, color:'#fff' },
  card: { background:'#131929', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'32px 28px' },
  title: { fontSize:'1.6rem', fontWeight:700, marginBottom:6 },
  subtitle: { color:'#7a8599', fontSize:'0.9rem', marginBottom:24 },
  error: { background:'rgba(255,77,106,0.12)', border:'1px solid rgba(255,77,106,0.3)', borderRadius:10, padding:'10px 14px', marginBottom:16, color:'#ff4d6a', fontSize:'0.88rem' },
  form: { display:'flex', flexDirection:'column', gap:16 },
  field: { display:'flex', flexDirection:'column', gap:6 },
  label: { fontSize:'0.85rem', fontWeight:500, color:'#a0aabe' },
  row: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  checkRow: { display:'flex', alignItems:'center', cursor:'pointer' },
  link: { background:'none', border:'none', color:'#00c896', cursor:'pointer', fontSize:'0.85rem', fontWeight:500 },
  divider: { textAlign:'center', margin:'20px 0', color:'#7a8599', fontSize:'0.82rem', position:'relative' },
  register: { textAlign:'center', fontSize:'0.88rem', color:'#7a8599', marginBottom:20 },
  badges: { display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', marginTop:20 },
  badge: { fontSize:'0.72rem', color:'#7a8599', background:'rgba(255,255,255,0.04)', borderRadius:20, padding:'4px 10px', border:'1px solid rgba(255,255,255,0.07)' },
  secureNote: { textAlign:'center', fontSize:'0.75rem', color:'#5a6578', marginTop:8 },
  demoBox: { marginTop:16, padding:'10px 14px', background:'rgba(0,200,150,0.05)', border:'1px solid rgba(0,200,150,0.15)', borderRadius:10 },
  back: { background:'none', border:'none', color:'#00c896', cursor:'pointer', fontSize:'0.85rem', marginBottom:16, padding:0 },
};
                    
