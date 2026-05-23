import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage({ onLogin }) {
  const [form, setForm] = useState({ name:'', phone:'', email:'', password:'', confirm:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Enter your full name'); return; }
    if (!/^\d{10}$/.test(form.phone)) { setError('Enter valid 10-digit number'); return; }
    if (form.password.length < 6) { setError('Password must be 6+ characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    onLogin({ phone: form.phone, name: form.name, role: 'user', balance: 0 });
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg}></div>
      <div style={styles.container}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>⚡</div>
          <span style={styles.logoText}>UltraPay</span>
        </div>
        <div style={styles.card}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join UltraPay to start transacting</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input className="input-field" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone Number</label>
              <input className="input-field" type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g,'').slice(0,10))} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email (optional)</label>
              <input className="input-field" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input className="input-field" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm Password</label>
              <input className="input-field" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
            </div>
            <button className="btn-primary" type="submit" style={{width:'100%',padding:'14px',fontSize:'1rem'}} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{textAlign:'center',marginTop:20,fontSize:'0.88rem',color:'#7a8599'}}>
            Already have an account? <Link to="/login" style={{color:'#00c896',fontWeight:600}}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0f1e', position:'relative' },
  bg: { position:'absolute', inset:0, background:'radial-gradient(ellipse at 20% 50%, rgba(0,200,150,0.08) 0%, transparent 60%)', pointerEvents:'none' },
  container: { position:'relative', zIndex:1, width:'100%', maxWidth:420, padding:'20px 16px' },
  logo: { display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:28 },
  logoIcon: { width:40, height:40, background:'#00c896', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' },
  logoText: { fontFamily:'Space Mono,monospace', fontSize:'1.4rem', fontWeight:700, color:'#fff' },
  card: { background:'#131929', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'32px 28px' },
  title: { fontSize:'1.6rem', fontWeight:700, marginBottom:6 },
  subtitle: { color:'#7a8599', fontSize:'0.9rem', marginBottom:24 },
  error: { background:'rgba(255,77,106,0.12)', border:'1px solid rgba(255,77,106,0.3)', borderRadius:10, padding:'10px 14px', marginBottom:16, color:'#ff4d6a', fontSize:'0.88rem' },
  form: { display:'flex', flexDirection:'column', gap:14 },
  field: { display:'flex', flexDirection:'column', gap:6 },
  label: { fontSize:'0.85rem', fontWeight:500, color:'#a0aabe' },
};
            
