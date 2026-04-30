(function () {
  const kategoriak = [...window.KATEGORIAK_SEED];
  const receptek = window.RECEPTEK_SEED.map(r => ({ ...r }));
  let nextId = Math.max(...receptek.map(r => r.id)) + 1;
  let editingId = null;

  const form = document.getElementById('recipe-form');
  const list = document.getElementById('recipe-list');
  const formTitle = document.getElementById('form-title');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const categorySelect = document.getElementById('kategoriaid');
  const filterCategory = document.getElementById('filter-category');
  const search = document.getElementById('search');

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

  function categoryName(id) {
    const k = kategoriak.find(x => x.id === Number(id));
    return k ? k.nev : 'ismeretlen';
  }

  function fillCategories() {
    categorySelect.innerHTML = '<option value="">Kategória</option>' + kategoriak.map(k =>
      `<option value="${k.id}">${escapeHtml(k.nev)}</option>`
    ).join('');
    filterCategory.innerHTML = '<option value="">Minden kategória</option>' + kategoriak.map(k =>
      `<option value="${k.id}">${escapeHtml(k.nev)}</option>`
    ).join('');
  }

  function filteredRecipes() {
    const q = search.value.trim().toLowerCase();
    const selected = filterCategory.value;
    return receptek.filter(r => {
      const matchesText = !q || r.nev.toLowerCase().includes(q);
      const matchesCategory = !selected || String(r.kategoriaid) === selected;
      return matchesText && matchesCategory;
    });
  }

  function render() {
    list.innerHTML = '';
    filteredRecipes().forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${escapeHtml(r.nev)}</td>
        <td><span class="badge">${escapeHtml(categoryName(r.kategoriaid))}</span></td>
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
    const r = receptek.find(x => x.id === id);
    if (!r) return;
    editingId = id;
    document.getElementById('recipe-id').value = r.id;
    document.getElementById('nev').value = r.nev;
    document.getElementById('kategoriaid').value = r.kategoriaid;
    document.getElementById('felirdatum').value = r.felirdatum || '';
    document.getElementById('elsodatum').value = r.elsodatum || '';
    formTitle.textContent = 'Recept módosítása (#' + id + ')';
    saveBtn.textContent = 'Mentés';
    cancelBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const kategoriaid = Number(document.getElementById('kategoriaid').value);
    const payload = {
      nev: document.getElementById('nev').value.trim(),
      kategoriaid,
      kategoria: categoryName(kategoriaid),
      felirdatum: document.getElementById('felirdatum').value,
      elsodatum: document.getElementById('elsodatum').value || null
    };

    if (editingId) {
      const i = receptek.findIndex(r => r.id === editingId);
      receptek[i] = { id: editingId, ...payload };
    } else {
      receptek.push({ id: nextId++, ...payload });
    }
    resetForm();
    render();
  });

  cancelBtn.addEventListener('click', resetForm);
  search.addEventListener('input', render);
  filterCategory.addEventListener('change', render);

  list.addEventListener('click', (e) => {
    const editId = e.target.dataset.edit;
    const delId = e.target.dataset.delete;
    if (editId) startEdit(Number(editId));
    if (delId && confirm('Biztosan törlöd?')) {
      const id = Number(delId);
      const i = receptek.findIndex(r => r.id === id);
      if (i >= 0) receptek.splice(i, 1);
      render();
    }
  });

  fillCategories();
  render();
})();
