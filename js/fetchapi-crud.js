(function () {
  const API = 'api/';
  const kategoriak = [...window.KATEGORIAK_SEED];
  const form = document.getElementById('recipe-form');
  const list = document.getElementById('recipe-list');
  const formTitle = document.getElementById('form-title');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const msg = document.getElementById('msg');
  const categorySelect = document.getElementById('kategoriaid');
  let editingId = null;
  let cache = [];

  function showMsg(text, type = 'success') {
    msg.innerHTML = `<div class="msg ${type}">${escapeHtml(text)}</div>`;
    setTimeout(() => { msg.innerHTML = ''; }, 3500);
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }

  function formatDate(value) {
    if (!value) return '-';
    const parts = String(value).split('-');
    return parts.length === 3 ? `${parts[0]}.${parts[1]}.${parts[2]}.` : value;
  }

  function fillCategories() {
    categorySelect.innerHTML = '<option value="">Kategória</option>' + kategoriak.map(k =>
      `<option value="${k.id}">${escapeHtml(k.nev)}</option>`
    ).join('');
  }

  async function apiGet(endpoint) {
    const r = await fetch(API + endpoint);
    return r.json();
  }

  async function apiPost(endpoint, payload) {
    const r = await fetch(API + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return r.json();
  }

  async function loadList() {
    try {
      const res = await apiGet('list.php');
      if (!res.success) throw new Error(res.error || 'Ismeretlen hiba');
      cache = res.data;
      renderRows(cache);
    } catch (e) {
      showMsg('Hiba a lista betöltésekor: ' + e.message, 'error');
    }
  }

  function renderRows(receptek) {
    list.innerHTML = '';
    receptek.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${escapeHtml(r.nev)}</td>
        <td><span class="badge">${escapeHtml(r.kategoria || '')}</span></td>
        <td>${formatDate(r.felirdatum)}</td>
        <td>${formatDate(r.elsodatum)}</td>
        <td class="actions">
          <button type="button" data-edit="${r.id}">Módosít</button>
          <button type="button" class="danger" data-delete="${r.id}">Töröl</button>
        </td>
      `;
      list.appendChild(tr);
    });
  }

  function resetForm() {
    form.reset();
    editingId = null;
    document.getElementById('recipe-id').value = '';
    formTitle.textContent = 'Új recept hozzáadása';
    saveBtn.textContent = 'Hozzáadás';
    cancelBtn.style.display = 'none';
  }

  function startEdit(id) {
    const r = cache.find(x => Number(x.id) === Number(id));
    if (!r) return;
    editingId = Number(r.id);
    document.getElementById('recipe-id').value = r.id;
    document.getElementById('nev').value = r.nev;
    document.getElementById('kategoriaid').value = r.kategoriaid;
    document.getElementById('felirdatum').value = r.felirdatum || '';
    document.getElementById('elsodatum').value = r.elsodatum || '';
    formTitle.textContent = 'Recept módosítása (#' + r.id + ')';
    saveBtn.textContent = 'Mentés';
    cancelBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      nev: document.getElementById('nev').value.trim(),
      kategoriaid: Number(document.getElementById('kategoriaid').value),
      felirdatum: document.getElementById('felirdatum').value,
      elsodatum: document.getElementById('elsodatum').value || null
    };

    try {
      const res = editingId
        ? await apiPost('update.php', { id: editingId, ...payload })
        : await apiPost('create.php', payload);
      if (!res.success) throw new Error(res.error || 'Ismeretlen hiba');
      showMsg(editingId ? 'Sikeres módosítás' : 'Sikeres hozzáadás');
      resetForm();
      await loadList();
    } catch (err) {
      showMsg('Hiba: ' + err.message, 'error');
    }
  });

  cancelBtn.addEventListener('click', resetForm);

  list.addEventListener('click', async (e) => {
    if (e.target.dataset.edit) startEdit(Number(e.target.dataset.edit));
    if (e.target.dataset.delete && confirm('Biztosan törlöd?')) {
      try {
        const res = await apiPost('delete.php', { id: Number(e.target.dataset.delete) });
        if (!res.success) throw new Error(res.error || 'Ismeretlen hiba');
        showMsg('Sikeres törlés');
        await loadList();
      } catch (err) {
        showMsg('Hiba: ' + err.message, 'error');
      }
    }
  });

  fillCategories();
  loadList();
})();
