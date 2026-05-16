import './RecipePrintButton.css';

interface PrintRecipeButtonProps {
  recipe: {
    name: string;
    description?: string;
    instructions: string;
    arrImage?: string;
    prepTime?: number;
    totalTime?: number;
    level?: number;
    ingredients?: {
      ingredientName?: string;
      quantity: number;
      unit: string;
    }[];
  };
}

const LEVEL_LABELS: Record<number, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

export default function PrintRecipeButton({ recipe }: PrintRecipeButtonProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    const ingredientRows = recipe.ingredients?.map(ing => `
      <tr>
        <td>${ing.ingredientName ?? 'Unknown'}</td>
        <td>${ing.quantity} ${ing.unit}</td>
      </tr>
    `).join('') ?? '<tr><td colspan="2">No ingredients listed</td></tr>';

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${recipe.name}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: 'Georgia', serif;
            color: #2d1a1a;
            background: #fff;
            padding: 40px;
            max-width: 780px;
            margin: 0 auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 24px;
            border-bottom: 3px solid #e8799a;
            padding-bottom: 20px;
            margin-bottom: 28px;
          }

          .header-left { flex: 1; }

          .brand {
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #e8799a;
            margin-bottom: 8px;
          }

          h1 {
            font-size: 2rem;
            color: #2d1a1a;
            line-height: 1.2;
            margin-bottom: 10px;
          }

          .description {
            font-size: 0.9rem;
            color: #666;
            font-style: italic;
            line-height: 1.5;
          }

          .recipe-image {
            width: 160px;
            height: 160px;
            object-fit: cover;
            border-radius: 16px;
            border: 3px solid #f3d6e4;
            flex-shrink: 0;
          }

          .no-image {
            width: 160px;
            height: 160px;
            border-radius: 16px;
            border: 3px solid #f3d6e4;
            background: #fdf2f8;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            flex-shrink: 0;
          }

          .meta {
            display: flex;
            gap: 16px;
            margin-bottom: 28px;
            flex-wrap: wrap;
          }

          .meta-pill {
            background: #fdf2f8;
            border: 1px solid #f3d6e4;
            border-radius: 20px;
            padding: 4px 14px;
            font-size: 0.82rem;
            color: #b5476e;
            font-family: sans-serif;
          }

          .body {
            display: grid;
            grid-template-columns: 1fr 1.6fr;
            gap: 32px;
          }

          h2 {
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #e8799a;
            margin-bottom: 14px;
            font-family: sans-serif;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.88rem;
          }

          td {
            padding: 7px 4px;
            border-bottom: 1px solid #f5e6ec;
            vertical-align: top;
          }

          td:first-child { color: #333; font-weight: 500; }
          td:last-child  { color: #888; text-align: right; white-space: nowrap; }

          .steps { counter-reset: step; }

          .step {
            display: flex;
            gap: 14px;
            margin-bottom: 16px;
            font-size: 0.9rem;
            line-height: 1.6;
          }

          .step-num {
            min-width: 28px;
            height: 28px;
            background: #e8799a;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.78rem;
            font-weight: bold;
            font-family: sans-serif;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .footer {
            margin-top: 36px;
            padding-top: 12px;
            border-top: 1px solid #f3d6e4;
            font-size: 0.75rem;
            color: #bbb;
            text-align: center;
            font-family: sans-serif;
          }

          @media print {
            body { padding: 20px; }
            @page { margin: 1cm; }
          }
        </style>
      </head>
      <body>

        <div class="header">
          <div class="header-left">
            <div class="brand">Sweet &amp; Treat</div>
            <h1>${recipe.name}</h1>
            ${recipe.description ? `<p class="description">${recipe.description}</p>` : ''}
          </div>
          ${recipe.arrImage
            ? `<img class="recipe-image" src="${recipe.arrImage}" alt="${recipe.name}" />`
            : `<div class="no-image">🍰</div>`
          }
        </div>

        <div class="meta">
          ${recipe.prepTime  ? `<span class="meta-pill">⏱ Prep: ${recipe.prepTime} min</span>` : ''}
          ${recipe.totalTime ? `<span class="meta-pill">🕐 Total: ${recipe.totalTime} min</span>` : ''}
          ${recipe.level     ? `<span class="meta-pill">📊 ${LEVEL_LABELS[recipe.level] ?? recipe.level}</span>` : ''}
        </div>

        <div class="body">
          <div>
            <h2>Ingredients</h2>
            <table>
              <tbody>${ingredientRows}</tbody>
            </table>
          </div>

          <div>
            <h2>Instructions</h2>
            <div class="steps">
              ${recipe.instructions
                .split(/\n+/)
                .filter(s => s.trim())
                .map((step, i) => `
                  <div class="step">
                    <div class="step-num">${i + 1}</div>
                    <div>${step.trim()}</div>
                  </div>
                `).join('')}
            </div>
          </div>
        </div>

        <div class="footer">
          Printed from Sweet &amp; Treat • sweetandtreat.com
        </div>

        <script>
          window.onload = () => { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <button className="print-recipe-btn" onClick={handlePrint} title="Print recipe">
      <img src='/src/assets/icons/printer.png' alt="Print" className="print-recipe-icon" />
      Print Recipe
    </button>
  );
}