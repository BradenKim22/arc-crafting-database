import items from "../data/loot.json";

export default function Registry() {
  return (
    <div>
      <h1>Global Item Registry</h1>
      <p>Total Items: {items.length}</p>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Rarity</th>
            <th>Category</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.ItemID}>
              <td>{item.ItemID}</td>
              <td>{item.ItemName}</td>
              <td>{item.Quality}</td>
              <td>{item.ItemCategory}</td>
              <td>{item.ItemDescription}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}