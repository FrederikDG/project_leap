import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';

import '../styles/Dashboard.css';

export default function Dashboard() {
  const [secret, setSecret] = useState('');

  useEffect(() => {
    api
      .get('/api/secure-data')
      .then(res => setSecret(res.data.secret))
      .catch(() => setSecret('Failed to fetch secret'));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Protected message: {secret}</p>
    </div>
  );
}
