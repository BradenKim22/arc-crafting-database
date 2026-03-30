export default function CraftingPage() {
  const [recipes] = useState(craftingRecipes);

  // Group rows by blueprint (important!)
  const grouped = recipes.reduce((acc, row) => {
    if (!acc[row.blueprintName]) {
      acc[row.blueprintName] = {
        output: row.outputItemName,
        components: []
      };
    }

    acc[row.blueprintName].components.push(row);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      <h1>Crafting Recipes</h1>

      {Object.entries(grouped).map(([blueprint, data]) => (
        <div
          key={blueprint}
          style={{
            border: "2px solid #444",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "20px",
            background: "#1e1e1e",
            color: "white"
          }}
        >
          <h2>{blueprint}</h2>
          <p><b>Creates:</b> {data.output}</p>

          <h3>Required Materials</h3>
          <ul>
            {data.components.map((c, i) => (
              <li key={i}>
                {c.quantityRequired}x {c.componentName}

                {c.breaksInto && (
                  <span style={{ color: "#f5b942" }}>
                    {" "} (Recycle → {c.breakdownQuantity}x {c.breaksInto})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
