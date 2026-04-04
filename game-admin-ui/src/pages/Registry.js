//import items from "../data/loot.json";

import React, { useState, useEffect } from 'react';

export default function Registry() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/registry')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching registry:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading item registry...</p>;
  
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