import { useState } from 'react';

const PAIRS = ['só', 'bors', 'kapor', 'paprika'];

function shuffleDeck() {
  return [...PAIRS, ...PAIRS]
    .map((value, index) => ({ id: index + '-' + value, value }))
    .sort(() => Math.random() - 0.5);
}

function MemoryCard({ card, open, done, onClick }) {
  const cls = 'memory-card' + (open ? ' open' : '') + (done ? ' done' : '');
  return <button className={cls} onClick={onClick}>{open || done ? card.value : '?'}</button>;
}

export default function MemoryGame() {
  const [deck, setDeck] = useState(shuffleDeck);
  const [open, setOpen] = useState([]);
  const [done, setDone] = useState([]);
  const [moves, setMoves] = useState(0);

  const click = (card) => {
    if (open.includes(card.id) || done.includes(card.value) || open.length === 2) return;
    const next = [...open, card.id];
    setOpen(next);

    if (next.length === 2) {
      setMoves(moves + 1);
      const selected = deck.filter(c => next.includes(c.id));
      if (selected[0].value === selected[1].value) {
        setDone([...done, selected[0].value]);
        setOpen([]);
      } else {
        setTimeout(() => setOpen([]), 700);
      }
    }
  };

  const reset = () => {
    setDeck(shuffleDeck());
    setOpen([]);
    setDone([]);
    setMoves(0);
  };

  return (
    <section className="panel">
      <h2>Konyhai memória</h2>
      <div className="memory-status"><span>Lépések: {moves}</span><span>Párok: {done.length}/{PAIRS.length}</span></div>
      <div className="memory-grid">
        {deck.map(card => <MemoryCard key={card.id} card={card} open={open.includes(card.id)} done={done.includes(card.value)} onClick={() => click(card)} />)}
      </div>
      <button className="reset" onClick={reset}>Új keverés</button>
    </section>
  );
}
