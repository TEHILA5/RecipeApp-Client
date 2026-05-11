import { useMemo, useState } from 'react';
import { useGetAllConversionsQuery } from '../../../api/adminApi';
import Loading from '../../../shared/components/UI/Loading';
import './ConversionsPage.css';

export default function ConversionsPage() {
  const { data: conversions = [], isLoading } = useGetAllConversionsQuery();

  const [search, setSearch] = useState('');
  const [calcFrom, setCalcFrom] = useState('');
  const [calcAmount, setCalcAmount] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return conversions.filter(
      (c) =>
        c.ingredient1Name?.toLowerCase().includes(q) ||
        c.ingredient2Name?.toLowerCase().includes(q)
    );
  }, [conversions, search]);

  const calcResults = useMemo(() => {
    if (!calcFrom.trim() || !calcAmount) return [];
    const amount = parseFloat(calcAmount);
    if (!amount || amount <= 0) return [];

    const name = calcFrom.toLowerCase();
    const results: { to: string; amount: number; ratio: number; bidirectional: boolean }[] = [];

    for (const conv of conversions) {
      const n1 = conv.ingredient1Name?.toLowerCase();
      const n2 = conv.ingredient2Name?.toLowerCase();
      const ratio = conv.conversionRatio ?? 1;

      if (n1 === name) {
        results.push({ to: conv.ingredient2Name, amount: +(amount * ratio).toFixed(3), ratio, bidirectional: !!conv.isBidirectional });
      } else if (n2 === name && conv.isBidirectional) {
        const inv = ratio !== 0 ? 1 / ratio : 1;
        results.push({ to: conv.ingredient1Name, amount: +(amount * inv).toFixed(3), ratio: +inv.toFixed(4), bidirectional: true });
      }
    }

    return results;
  }, [calcFrom, calcAmount, conversions]);

  const ingredientNames = useMemo(() => {
    const names = new Set<string>();
    conversions.forEach((c) => {
      if (c.ingredient1Name) names.add(c.ingredient1Name);
      if (c.ingredient2Name) names.add(c.ingredient2Name);
    });
    return Array.from(names).sort();
  }, [conversions]);

  return (
    <div className="conversions-page">
      <div className="conversions-header">
        <div className="conversions-header-inner">
          <div className="header-eyebrow">✦ Ingredient Conversions</div>
          <h1 style={{ display: 'flex', alignItems: 'center',placeSelf: 'center', gap: '4px', }}>Substitution <span>Guide</span>
          <img src="/src/assets/icons/action-refresh.png" alt="" style={{ width: '55px', height: '55px', objectFit: 'contain', verticalAlign: 'middle' }} />
          </h1>
          <p>Find ingredient substitutes and calculate exact amounts</p>
        </div>
      </div>

      <div className="conversions-body">
        <div className="calc-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '4px', }}> 
            <img src="/src/assets/icons/calc-calculator.png" alt="" style={{ width: '35px', height: '35px', objectFit: 'contain', verticalAlign: 'middle' }} />
            {' '}Quick Calculator
            </h2>
          <p>Enter an ingredient and amount to see all its substitutes</p>

          <div className="calc-inputs">
            <div className="calc-amount">
              <label>Amount</label>
              <input
                type="number"
                min="0.01"
                step="0.1"
                value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value)}
                placeholder="1.5"
              />
            </div>
            <div className="calc-ingredient">
              <label>Ingredient</label>
              <input
                type="text"
                list="ingredient-names"
                value={calcFrom}
                onChange={(e) => setCalcFrom(e.target.value)}
                placeholder="e.g. honey, butter, sugar..."
              />
              <datalist id="ingredient-names">
                {ingredientNames.map((n) => <option key={n} value={n} />)}
              </datalist>
            </div>
          </div>

          {calcFrom && calcAmount && calcResults.length === 0 && (
            <div className="calc-empty" style={{ display: 'flex', alignItems: 'center', gap: '4px', }}> 
            <img src="/src/assets/icons/state-empty.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
            {' '}No conversions found for "{calcFrom}"
            </div>
          )}

          {calcResults.length > 0 && (
            <div className="calc-results">
              {calcResults.map(({ to, amount, ratio }) => (
                <div key={to} className="calc-result-row">
                  <div className="calc-result-left">
                    <span>
                      <img src="/src/assets/icons/action-refresh.png" alt="" style={{ width: '30px', height: '30px', objectFit: 'contain', verticalAlign: 'middle' }} /> 
                    </span>
                    <div>
                      <strong>{calcAmount} </strong>
                      <span className="ingredient-name">{calcFrom}</span>
                      <span className="arrow">→</span>
                      <strong>{amount} </strong>
                      <span className="ingredient-name">{to}</span>
                    </div>
                  </div>
                  <span className="ratio-badge">×{ratio}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="table-card">
          <div className="table-header">
            <h2>All Conversions ({conversions.length})</h2>
            <div className="search-wrapper">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ingredient..."
              />
              <span>
                <img src="/src/assets/icons/search-icon.png" alt="Search" style={{ width: '35px', height: '35px', objectFit: 'contain' }} />
              </span>
            </div>
          </div>

          {isLoading ? (
            <Loading message="Loading..." color="#7c3aed" />
          ) : filtered.length === 0 ? (
            <div className="table-empty">
              <div>
                <img src="/src/assets/icons/action-refresh.png" alt="" style={{ width: '30px', height: '30px', objectFit: 'contain', verticalAlign: 'middle' }} /> 
              </div>
              <p>{search ? 'No results found' : 'No conversions available yet'}</p>
            </div>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {['Ingredient', '', 'Substitute', 'Ratio', 'Direction'].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((conv, idx) => (
                    <tr key={conv.id} className={idx % 2 === 0 ? 'even' : 'odd'}>
                      <td className="ingredient-cell">{conv.ingredient1Name}</td>
                      <td className="arrow-cell">{conv.isBidirectional ? '↔' : '→'}</td>
                      <td className="ingredient-cell">{conv.ingredient2Name}</td>
                      <td><span className="ratio-mono" style={{ display: 'flex', alignItems: 'center', gap: '4px', }}><img src="/src/assets/icons/cancel-x.png" alt="" style={{ width: '10px', height: '10px', objectFit: 'contain', verticalAlign: 'middle' }} /> 
                    {conv.conversionRatio}</span></td>
                      <td>
                        <span className={`direction-badge ${conv.isBidirectional ? 'both' : 'one'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
                          {conv.isBidirectional ? <><img src="/src/assets/icons/arrow2.png" alt="↔" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />{' '}Both</>
                            : <><img src="/src/assets/icons/arrow1.png" alt="->" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />{' '}One-way</>}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
