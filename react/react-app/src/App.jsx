import { useState } from 'react';
import { KATEGORIAK, RECEPTEK } from './data.js';

const EMPTY = { nev: '', kategoriaid: '', felirdatum: '', elsodatum: '' };

function formatDate(value) {
  if (!value) return '-';
  const parts = String(value).split('-');
  return parts.length === 3 ? `${parts[0]}.${parts[1]}.${parts[2]}.` : value;
}

function categoryName(id) {
  return KATEGORIAK.find(k => k.id === Number(id))?.nev || 'ismeretlen';
}

export default function App() {
  const [receptek, setReceptek] = useState(RECEPTEK);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const filtered = receptek.filter(r => {
    const matchesText = !search || r.nev.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filter || String(r.kategoriaid) === filter;
    return matchesText && matchesCategory;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      nev: form.nev.trim(),
      kategoriaid: Number(form.kategoriaid),
      kategoria: categoryName(form.kategoriaid),
      felirdatum: form.felirdatum,
      elsodatum: form.elsodatum || null
    };

    if (editingId) {
      setReceptek(receptek.map(r => r.id === editingId ? { id: editingId, ...payload } : r));
    } else {
      const nextId = Math.max(0, ...receptek.map(r => r.id)) + 1;
      setReceptek([...receptek, { id: nextId, ...payload }]);
    }
    setForm(EMPTY);
    setEditingId(null);
  };

  const handleEdit = (r) => {
    setEditingId(r.id);
    setForm({ nev: r.nev, kategoriaid: r.kategoriaid, felirdatum: r.felirdatum || '', elsodatum: r.elsodatum || '' });
  };

  const handleDelete = (id) => {
    if (confirm('Biztosan törlöd?')) setReceptek(receptek.filter(r => r.id !== id));
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  return (
    <div className="app">
      <h1>React CRUD - Receptek</h1>
      <p>React komponensek és useState hook kezelik a kliens oldali receptlistát.</p>

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
            <button type="submit">{editingId ? 'Mentés' : 'Hozzáadás'}</button>
            {editingId && <button type="button" className="secondary" onClick={handleCancel}>Mégse</button>}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Receptek listája ({filtered.length})</h2>
        <div className="toolbar">
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Keresés receptnév szerint" />
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">Minden kategória</option>
            {KATEGORIAK.map(k => <option key={k.id} value={k.id}>{k.nev}</option>)}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Név</th><th>Kategória</th><th>Felírás dátuma</th><th>Első elkészítés</th><th>Műveletek</th></tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.nev}</td>
                  <td><span className="badge">{categoryName(r.kategoriaid)}</span></td>
                  <td>{formatDate(r.felirdatum)}</td>
                  <td>{formatDate(r.elsodatum)}</td>
                  <td className="actions">
                    <button className="small" onClick={() => handleEdit(r)}>Módosít</button>
                    <button className="small danger" onClick={() => handleDelete(r.id)}>Töröl</button>
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
