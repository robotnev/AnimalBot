import './App.css'
import { useState } from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Card1 from './Card1';
import Card2 from './Card2';

function App() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="cards">
          <Card1 className="card" />
          <Card2 className="card" />
        </div>} />
        <Route path="/home" element={<Card1 />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
