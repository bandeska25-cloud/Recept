(function () {
  const e = React.createElement;
  const { useState } = React;
  const KATEGORIAK = window.KATEGORIAK_SEED || [];
  const SEED = window.RECEPTEK_SEED || [];
  const EMPTY = { nev: '', kategoriaid: '', felirdatum: '', elsodatum: '' };

  function formatDate(value) {
    if (!value) return '-';
    const parts = String(value).split('-');
    return parts.length === 3 ? `${parts[0]}.${parts[1]}.${parts[2]}.` : value;
  }

  function categoryName(id) {
    const found = KATEGORIAK.find(k => k.id === Number(id));
    return found ? found.nev : 'ismeretlen';
  }

  function App() {
    const [receptek, setReceptek] = useState(SEED);
    const [form, setForm] = useState(EMPTY);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    const handleChange = (ev) => setForm({ ...form, [ev.target.name]: ev.target.value });
    const filtered = receptek.filter(r => {
      const matchesText = !search || r.nev.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !filter || String(r.kategoriaid) === filter;
      return matchesText && matchesCategory;
    });

    function submit(ev) {
      ev.preventDefault();
      const payload = {
        nev: form.nev.trim(),
        kategoriaid: Number(form.kategoriaid),
        kategoria: categoryName(form.kategoriaid),
        felirdatum: form.felirdatum,
        elsodatum: form.elsodatum || null
      };
      if (editingId) setReceptek(receptek.map(r => r.id === editingId ? { id: editingId, ...payload } : r));
      else setReceptek([...receptek, { id: Math.max(0, ...receptek.map(r => r.id)) + 1, ...payload }]);
      setForm(EMPTY);
      setEditingId(null);
    }

    function edit(r) {
      setEditingId(r.id);
      setForm({ nev: r.nev, kategoriaid: r.kategoriaid, felirdatum: r.felirdatum || '', elsodatum: r.elsodatum || '' });
    }

    function remove(id) {
      if (confirm('Biztosan törlöd?')) setReceptek(receptek.filter(r => r.id !== id));
    }

    return e('div', { className: 'app' },
      e('h1', null, 'React CRUD - Receptek'),
      e('p', null, 'React komponensek és useState hook kezelik a kliens oldali receptlistát.'),
      e('section', { className: 'card' },
        e('h2', null, editingId ? `Recept módosítása (#${editingId})` : 'Új recept hozzáadása'),
        e('form', { onSubmit: submit },
          e('div', { className: 'form-grid' },
            e('input', { name: 'nev', value: form.nev, onChange: handleChange, placeholder: 'Étel neve', required: true }),
            e('select', { name: 'kategoriaid', value: form.kategoriaid, onChange: handleChange, required: true },
              e('option', { value: '' }, 'Kategória'),
              KATEGORIAK.map(k => e('option', { key: k.id, value: k.id }, k.nev))
            ),
            e('input', { name: 'felirdatum', type: 'date', value: form.felirdatum, onChange: handleChange, required: true }),
            e('input', { name: 'elsodatum', type: 'date', value: form.elsodatum, onChange: handleChange })
          ),
          e('div', { className: 'button-row' },
            e('button', { type: 'submit' }, editingId ? 'Mentés' : 'Hozzáadás'),
            editingId && e('button', { type: 'button', className: 'secondary', onClick: () => { setEditingId(null); setForm(EMPTY); } }, 'Mégse')
          )
        )
      ),
      e('section', { className: 'card' },
        e('h2', null, `Receptek listája (${filtered.length})`),
        e('div', { className: 'toolbar' },
          e('input', { type: 'search', value: search, onChange: ev => setSearch(ev.target.value), placeholder: 'Keresés receptnév szerint' }),
          e('select', { value: filter, onChange: ev => setFilter(ev.target.value) },
            e('option', { value: '' }, 'Minden kategória'),
            KATEGORIAK.map(k => e('option', { key: k.id, value: k.id }, k.nev))
          )
        ),
        e('div', { className: 'table-wrap' },
          e('table', null,
            e('thead', null, e('tr', null, ['ID','Név','Kategória','Felírás dátuma','Első elkészítés','Műveletek'].map(h => e('th', { key: h }, h)))),
            e('tbody', null, filtered.map(r => e('tr', { key: r.id },
              e('td', null, r.id),
              e('td', null, r.nev),
              e('td', null, e('span', { className: 'badge' }, categoryName(r.kategoriaid))),
              e('td', null, formatDate(r.felirdatum)),
              e('td', null, formatDate(r.elsodatum)),
              e('td', { className: 'actions' },
                e('button', { className: 'small', onClick: () => edit(r) }, 'Módosít'),
                e('button', { className: 'small danger', onClick: () => remove(r.id) }, 'Töröl')
              )
            )))
          )
        )
      )
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(e(App));
})();
