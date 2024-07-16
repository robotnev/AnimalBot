import './App.css'
import { useState } from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup_Card from './Signup_Card';
import Login_Card from './Login_Card';
import Loading from './Loading';
import Yes from './Yes';
import Taskbar from './Taskbar';
function App() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');


  return (
    <BrowserRouter>
      <Taskbar />
      <Routes>
        <Route path="/" element={<div className="cards">
          <Signup_Card className="card" />
          <Login_Card className="card" />
        </div>} />
        <Route path="/home" element={<Yes />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
