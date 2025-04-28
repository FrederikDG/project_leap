import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import { useParams } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { campaignSlug } = useParams();


  return (
    <div className='content__container'>
      <h1>{campaignSlug.replace(/-/g, ' ')} Dashboard</h1>
    </div>
  );
}
