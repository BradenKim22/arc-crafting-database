//const sessions = [
//  {User:"Alice Smith", Email:"alice@test.com", Date:"2026-03-29"},
//  {User:"Bob Lee", Email:"bob@test.com", Date:"2026-03-30"}
//];

import React, { useState, useEffect } from 'react';

export default function Sessions() {

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/sessions')
      .then(res => res.json())
      .then(data => {
        setSessions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching sessions:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading active sessions...</p>;

  return (
    <div>
      <h1>Active Sessions</h1>
      <table border="1">
        <thead>
          <tr>
            <th>User</th><th>Email</th><th>Login Date</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s,i)=>(
            <tr key={i}>
              <td>{s.User}</td>
              <td>{s.Email}</td>
              <td>{s.Date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}