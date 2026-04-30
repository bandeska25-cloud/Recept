import { useState } from 'react';

const RECIPES = {
  gulyas: {
    name: 'Gulyásleves',
    base: 4,
    ingredients: [
      { name: 'marhahús', amount: 60, unit: 'dkg' },
      { name: 'krumpli', amount: 50, unit: 'dkg' },
      { name: 'vöröshagyma', amount: 2, unit: 'fej' },
      { name: 'fűszerpaprika', amount: 2, unit: 'teáskanál' }
    ]
  },
  makos: {
    name: 'Mákos guba',
    base: 4,
    ingredients: [
      { name: 'kifli', amount: 10, unit: 'darab' },
      { name: 'tej', amount: 0.5, unit: 'liter' },
      { name: 'mák', amount: 10, unit: 'dkg' },
      { name: 'porcukor', amount: 5, unit: 'dkg' }
    ]
  }
};

function round(value) {
  return Number.isInteger(value) ? value : Number(value.toFixed(2));
}

export default function PortionCalculator() {
  const [recipeId, setRecipeId] = useState('gulyas');
  const [servings, setServings] = useState(4);
  const recipe = RECIPES[recipeId];
  const ratio = servings / recipe.base;

  return (
    <section className="panel">
      <h2>Adag kalkulátor</h2>
      <div className="form-row">
        <select value={recipeId} onChange={e => setRecipeId(e.target.value)}>
          {Object.entries(RECIPES).map(([id, r]) => <option key={id} value={id}>{r.name}</option>)}
        </select>
        <input type="number" min="1" max="20" value={servings} onChange={e => setServings(Number(e.target.value))} />
      </div>
      <ul className="ingredient-list">
        {recipe.ingredients.map(item => (
          <li key={item.name}><span>{item.name}</span><strong>{round(item.amount * ratio)} {item.unit}</strong></li>
        ))}
      </ul>
    </section>
  );
}
