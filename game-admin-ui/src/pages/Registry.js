const items = [
  {Name:"Iron Sword", Category:"Weapon", Quality:"Common", Method:"Craft"},
  {Name:"Dragon Scale", Category:"Material", Quality:"Epic", Method:"Drop"}
];

export default function Registry() {
  return (
    <div>
      <h1>Global Item Registry</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th><th>Category</th><th>Quality</th><th>Acquisition</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item,i)=>(
            <tr key={i}>
              <td>{item.Name}</td>
              <td>{item.Category}</td>
              <td>{item.Quality}</td>
              <td>{item.Method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}