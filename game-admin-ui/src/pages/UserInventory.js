//const data = [
//  {FullName:"Alice Smith", ItemName:"Iron Sword", Category:"Weapon", Rarity:"Common"},
//  {FullName:"Bob Lee", ItemName:"Dragon Scale", Category:"Material", Rarity:"Epic"}
//];

import React, { useState, useEffect } from 'react';

export default function UserInventory() {
  // 1. Set up state to hold the incoming database rows
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch the data when the component loads
  useEffect(() => {
    fetch('http://localhost:5000/api/inventory')
      .then(res => {
        if (!res.ok) throw new Error('Network response failed');
        return res.json();
      })
      .then(data => {
        setInventory(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching inventory:", err));
  }, []);

  if (loading) return <p>Loading Raider stashes...</p>;
  
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
          {inventory.map((item,i)=>(
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