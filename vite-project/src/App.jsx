import './App.css'
import { useState } from 'react';
import * as React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Card1 from './Card1';
import Card2 from './Card2';
import Loading from './Loading';
import Yes from './Yes';
import Taskbar from './Taskbar';
function App() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [formData, setFormData] = useState({ name: '', password: '' });



  return (
    <BrowserRouter>
      <Taskbar/>
      <Routes>
        <Route path="/" element={<div className="cards">
          <Card1 className="card" />
          <Card2 className="card" formData={formData} setFormData={setFormData}/>
        </div>} />
        <Route path="/home" element={<Yes/>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
