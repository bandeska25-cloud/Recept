(function () {
  const e = React.createElement;
  const { useState } = React;
  const RECIPES = {
    gulyas: { name: 'Gulyásleves', base: 4, ingredients: [
      { name: 'marhahús', amount: 60, unit: 'dkg' },
      { name: 'krumpli', amount: 50, unit: 'dkg' },
      { name: 'vöröshagyma', amount: 2, unit: 'fej' },
      { name: 'fűszerpaprika', amount: 2, unit: 'teáskanál' }
    ]},
    makos: { name: 'Mákos guba', base: 4, ingredients: [
      { name: 'kifli', amount: 10, unit: 'darab' },
      { name: 'tej', amount: 0.5, unit: 'liter' },
      { name: 'mák', amount: 10, unit: 'dkg' },
      { name: 'porcukor', amount: 5, unit: 'dkg' }
    ]}
  };
  const PAIRS = ['só', 'bors', 'kapor', 'paprika'];
  const round = value => Number.isInteger(value) ? value : Number(value.toFixed(2));
  const shuffleDeck = () => [...PAIRS, ...PAIRS].map((value, index) => ({ id: index + '-' + value, value })).sort(() => Math.random() - 0.5);

  function PortionCalculator() {
    const [recipeId, setRecipeId] = useState('gulyas');
    const [servings, setServings] = useState(4);
    const recipe = RECIPES[recipeId];
    const ratio = servings / recipe.base;
    return e('section', { className: 'panel' },
      e('h2', null, 'Adag kalkulátor'),
      e('div', { className: 'form-row' },
        e('select', { value: recipeId, onChange: ev => setRecipeId(ev.target.value) }, Object.entries(RECIPES).map(([id, r]) => e('option', { key: id, value: id }, r.name))),
        e('input', { type: 'number', min: 1, max: 20, value: servings, onChange: ev => setServings(Number(ev.target.value)) })
      ),
      e('ul', { className: 'ingredient-list' }, recipe.ingredients.map(item => e('li', { key: item.name }, e('span', null, item.name), e('strong', null, `${round(item.amount * ratio)} ${item.unit}`))))
    );
  }

  function MemoryCard({ card, open, done, onClick }) {
    const cls = 'memory-card' + (open ? ' open' : '') + (done ? ' done' : '');
    return e('button', { className: cls, onClick }, open || done ? card.value : '?');
  }

  function MemoryGame() {
    const [deck, setDeck] = useState(shuffleDeck);
    const [open, setOpen] = useState([]);
    const [done, setDone] = useState([]);
    const [moves, setMoves] = useState(0);
    function click(card) {
      if (open.includes(card.id) || done.includes(card.value) || open.length === 2) return;
      const next = [...open, card.id];
      setOpen(next);
      if (next.length === 2) {
        setMoves(moves + 1);
        const selected = deck.filter(c => next.includes(c.id));
        if (selected[0].value === selected[1].value) { setDone([...done, selected[0].value]); setOpen([]); }
        else setTimeout(() => setOpen([]), 700);
      }
    }
    function reset() { setDeck(shuffleDeck()); setOpen([]); setDone([]); setMoves(0); }
    return e('section', { className: 'panel' },
      e('h2', null, 'Konyhai memória'),
      e('div', { className: 'memory-status' }, e('span', null, `Lépések: ${moves}`), e('span', null, `Párok: ${done.length}/${PAIRS.length}`)),
      e('div', { className: 'memory-grid' }, deck.map(card => e(MemoryCard, { key: card.id, card, open: open.includes(card.id), done: done.includes(card.value), onClick: () => click(card) }))),
      e('button', { className: 'reset', onClick: reset }, 'Új keverés')
    );
  }

  function App() {
    const [page, setPage] = useState('portion');
    return e('div', { className: 'spa' },
      e('h1', null, 'Receptes SPA'),
      e('p', null, 'Két React mini-alkalmazás egy oldalon, oldalújratöltés nélküli menüváltással.'),
      e('nav', { className: 'spa-nav' },
        e('button', { className: page === 'portion' ? 'active' : '', onClick: () => setPage('portion') }, 'Adag kalkulátor'),
        e('button', { className: page === 'memory' ? 'active' : '', onClick: () => setPage('memory') }, 'Konyhai memória')
      ),
      page === 'portion' ? e(PortionCalculator) : e(MemoryGame)
    );
  }
  ReactDOM.createRoot(document.getElementById('root')).render(e(App));
})();
