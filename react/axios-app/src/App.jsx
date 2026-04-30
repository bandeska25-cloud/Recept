import { useEffect, useState } from 'react';
import axios from 'axios';
import { KATEGORIAK } from './data.js';

const API = import.meta.env.VITE_API_BASE || '../../../api/';
const EMPTY = { nev: '', kategoriaid: '', felirdatum: '', elsodatum: '' };

function formatDate(value) {
  if (!value) return '-';
  const parts = String(value).split('-');
  return parts.length === 3 ? `${parts[0]}.${parts[1]}.${parts[2]}.` : value;
}

export default function App() {
  const [receptek, setReceptek] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3200);
  };

  const loadList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API + 'list.php');
      if (!res.data.success) throw new Error(res.data.error || 'Hiba');
      setReceptek(res.data.data);
    } catch (e) {
      flash('Betöltési hiba: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadList(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      nev: form.nev.trim(),
      kategoriaid: Number(form.kategoriaid),
      felirdatum: form.felirdatum,
      elsodatum: form.elsodatum || null
    };
    try {
      const res = editingId
        ? await axios.post(API + 'update.php', { id: editingId, ...payload })
        : await axios.post(API + 'create.php', payload);
      if (!res.data.success) throw new Error(res.data.error || 'Hiba');
      flash(editingId ? 'Sikeres módosítás' : 'Sikeres hozzáadás');
      setForm(EMPTY);
      setEditingId(null);
      await loadList();
    } catch (err) {
      flash('Hiba: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (r) => {
    setEditingId(Number(r.id));
    setForm({ nev: r.nev, kategoriaid: r.kategoriaid, felirdatum: r.felirdatum || '', elsodatum: r.elsodatum || '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Biztosan törlöd?')) return;
    setLoading(true);
    try {
      const res = await axios.post(API + 'delete.php', { id });
      if (!res.data.success) throw new Error(res.data.error || 'Hiba');
      flash('Sikeres törlés');
      await loadList();
    } catch (err) {
      flash('Hiba: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  return (
    <div className="app">
      <h1>Axios + PHP CRUD - Receptek</h1>
      <p>React és Axios hívások kapcsolódnak a PHP/PDO alapú szerveroldali recept API-hoz.</p>
      {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
      {loading && <div className="msg info">Betöltés...</div>}

      <section className="card">
        <h2>{editingId ? `Recept módosítása (#${editingId})` : 'Új recept hozzáadása'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="nev" value={form.nev} onChange={handleChange} placeholder="Étel neve" required />
            <select name="kategoriaid" value={form.kategoriaid} onChange={handleChange} required>
              <option value="">Kategória</option>
              {KATEGORIAK.map(k => <option key={k.id} value={k.id}>{k.nev}</option>)}
            </select>
            <input name="felirdatum" type="date" value={form.felirdatum} onChange={handleChange} required />
            <input name="elsodatum" type="date" value={form.elsodatum} onChange={handleChange} />
          </div>
          <div className="button-row">
            <button type="submit" disabled={loading}>{editingId ? 'Mentés' : 'Hozzáadás'}</button>
            {editingId && <button type="button" className="secondary" onClick={handleCancel}>Mégse</button>}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Receptek listája ({receptek.length})</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Név</th><th>Kategória</th><th>Felírás dátuma</th><th>Első elkészítés</th><th>Műveletek</th></tr>
            </thead>
            <tbody>
              {receptek.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td><td>{r.nev}</td><td><span className="badge">{r.kategoria}</span></td>
                  <td>{formatDate(r.felirdatum)}</td><td>{formatDate(r.elsodatum)}</td>
                  <td className="actions">
                    <button className="small" onClick={() => handleEdit(r)} disabled={loading}>Módosít</button>
                    <button className="small danger" onClick={() => handleDelete(r.id)} disabled={loading}>Töröl</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
