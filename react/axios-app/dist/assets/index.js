(function () {
  const e = React.createElement;
  const { useEffect, useState } = React;
  const API = '../../../api/';
  const KATEGORIAK = window.KATEGORIAK_SEED || [];
  const EMPTY = { nev: '', kategoriaid: '', felirdatum: '', elsodatum: '' };

  function formatDate(value) {
    if (!value) return '-';
    const parts = String(value).split('-');
    return parts.length === 3 ? `${parts[0]}.${parts[1]}.${parts[2]}.` : value;
  }

  function App() {
    const [receptek, setReceptek] = useState([]);
    const [form, setForm] = useState(EMPTY);
    const [editingId, setEditingId] = useState(null);
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    function flash(text, type = 'success') {
      setMsg({ text, type });
      setTimeout(() => setMsg(null), 3200);
    }

    async function loadList() {
      setLoading(true);
      try {
        const res = await axios.get(API + 'list.php');
        if (!res.data.success) throw new Error(res.data.error || 'Hiba');
        setReceptek(res.data.data);
      } catch (err) {
        flash('Betöltési hiba: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => { loadList(); }, []);
    const handleChange = ev => setForm({ ...form, [ev.target.name]: ev.target.value });

    async function submit(ev) {
      ev.preventDefault();
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
    }

    function edit(r) {
      setEditingId(Number(r.id));
      setForm({ nev: r.nev, kategoriaid: r.kategoriaid, felirdatum: r.felirdatum || '', elsodatum: r.elsodatum || '' });
    }

    async function remove(id) {
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
    }

    return e('div', { className: 'app' },
      e('h1', null, 'Axios + PHP CRUD - Receptek'),
      e('p', null, 'React és Axios hívások kapcsolódnak a PHP/PDO alapú szerveroldali recept API-hoz.'),
      msg && e('div', { className: `msg ${msg.type}` }, msg.text),
      loading && e('div', { className: 'msg info' }, 'Betöltés...'),
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
            e('button', { type: 'submit', disabled: loading }, editingId ? 'Mentés' : 'Hozzáadás'),
            editingId && e('button', { type: 'button', className: 'secondary', onClick: () => { setEditingId(null); setForm(EMPTY); } }, 'Mégse')
          )
        )
      ),
      e('section', { className: 'card' },
        e('h2', null, `Receptek listája (${receptek.length})`),
        e('div', { className: 'table-wrap' },
          e('table', null,
            e('thead', null, e('tr', null, ['ID','Név','Kategória','Felírás dátuma','Első elkészítés','Műveletek'].map(h => e('th', { key: h }, h)))),
            e('tbody', null, receptek.map(r => e('tr', { key: r.id },
              e('td', null, r.id),
              e('td', null, r.nev),
              e('td', null, e('span', { className: 'badge' }, r.kategoria)),
              e('td', null, formatDate(r.felirdatum)),
              e('td', null, formatDate(r.elsodatum)),
              e('td', { className: 'actions' },
                e('button', { className: 'small', onClick: () => edit(r), disabled: loading }, 'Módosít'),
                e('button', { className: 'small danger', onClick: () => remove(r.id), disabled: loading }, 'Töröl')
              )
            )))
          )
        )
      )
    );
  }
  ReactDOM.createRoot(document.getElementById('root')).render(e(App));
})();
