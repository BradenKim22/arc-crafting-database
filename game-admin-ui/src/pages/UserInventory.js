const data = [
  {FullName:"Alice Smith", ItemName:"Iron Sword", Category:"Weapon", Rarity:"Common"},
  {FullName:"Bob Lee", ItemName:"Dragon Scale", Category:"Material", Rarity:"Epic"}
];

export default function UserInventory() {
  return (
    <div>
      <h1>User Inventory</h1>
      <table border="1">
        <thead>
          <tr>
            <th>User</th><th>Item</th><th>Category</th><th>Rarity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item,i)=>(
            <tr key={i}>
              <td>{item.FullName}</td>
              <td>{item.ItemName}</td>
              <td>{item.Category}</td>
              <td>{item.Rarity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}