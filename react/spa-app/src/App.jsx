import { useState } from 'react';
import PortionCalculator from './PortionCalculator.jsx';
import MemoryGame from './MemoryGame.jsx';

export default function App() {
  const [page, setPage] = useState('portion');

  return (
    <div className="spa">
      <h1>Receptes SPA</h1>
      <p>Két React mini-alkalmazás egy oldalon, oldalújratöltés nélküli menüváltással.</p>
      <nav className="spa-nav">
        <button className={page === 'portion' ? 'active' : ''} onClick={() => setPage('portion')}>Adag kalkulátor</button>
        <button className={page === 'memory' ? 'active' : ''} onClick={() => setPage('memory')}>Konyhai memória</button>
      </nav>
      {page === 'portion' && <PortionCalculator />}
      {page === 'memory' && <MemoryGame />}
    </div>
  );
}
