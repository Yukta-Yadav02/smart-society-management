// src/constants.js

/* ================================
   API CONFIG
================================ */
export const API_BASE_URL = 'http://localhost:5000/api';

/* =========================================================
   ⚠️ TEMPORARY UI DATA (DUMMY)
   ❌ JSX / UI ko bilkul touch nahi karega
   ✅ Backend aate hi replace hoga
========================================================= */

/* ---------- WINGS ---------- */
export const ALL_WINGS = [
  {
    id: 'A',
    name: 'Elite Wing A',
    description: 'Experience luxury at its peak with premium units offering panoramic city views.',
  },
  {
    id: 'B',
    name: 'Royal Wing B',
    description: 'Elegant living spaces designed for comfort and modern lifestyle.',
  },
  {
    id: 'C',
    name: 'Garden Wing C',
    description: 'Serene environment with garden-facing premium homes.',
  },
  {
    id: 'D',
    name: 'Sky Wing D',
    description: 'Modern architecture with thoughtfully designed luxury flats.',
  },
];

/* ---------- FLATS ---------- */
export const ALL_FLATS = [
  {
    id: 'A-101',
    wing: 'A',
    block: 'Block 1',
    type: '2BHK Luxury',
    specs: 'Spacious living room with balcony and modular kitchen',
    status: 'Vacant',
    price: '₹ 3.2L',
  },
  {
    id: 'A-305',
    wing: 'A',
    block: 'Block 3',
    type: '3BHK Royal',
    specs: 'Large bedrooms with premium fittings',
    status: 'Vacant',
    price: '₹ 4.2L',
  },
  {
    id: 'B-203',
    wing: 'B',
    block: 'Block 2',
    type: '3BHK Elite',
    specs: 'Cross ventilation with scenic view',
    status: 'Vacant',
    price: '₹ 4.8L',
  },
  {
    id: 'C-402',
    wing: 'C',
    block: 'Block 4',
    type: '2BHK Comfort',
    specs: 'Peaceful garden-facing unit',
    status: 'Vacant',
    price: '₹ 3.6L',
  },
];

/* =========================================================
   🔁 BACKEND INTEGRATION (FUTURE – NO UI CHANGE)
========================================================= */

/*
import axios from 'axios';

useEffect(() => {
  axios.get(`${API_BASE_URL}/wings`)
    .then(res => setWings(res.data));

  axios.get(`${API_BASE_URL}/flats`)
    .then(res => setFlats(res.data));
}, []);
*/
