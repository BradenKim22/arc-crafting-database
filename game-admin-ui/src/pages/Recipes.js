const recipes = [
  {Blueprint:"Iron Sword", Components:"Iron x3", Workbench:"Forge", Level:1},
  {Blueprint:"Magic Staff", Components:"Wood x2, Crystal x1", Workbench:"Arcane Bench", Level:3}
];

export default function Recipes() {
  return (
    <div>
      <h1>Crafting Recipes</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Blueprint</th><th>Components</th><th>Workbench</th><th>Level</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((r,i)=>(
            <tr key={i}>
              <td>{r.Blueprint}</td>
              <td>{r.Components}</td>
              <td>{r.Workbench}</td>
              <td>{r.Level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}