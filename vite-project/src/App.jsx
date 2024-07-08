import './App.css'
import { useState } from 'react';
import './index.css';
function App() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');

  const handleChangeUser = (e) => {
    setUser(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  /*const handleCreate = () => {
    fetch(`${DATABASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setResult('create success!');
          <button onClick={handleCreate}>Create</button>
        } else {
          setResult('failed to create!');
        }
      })
      .catch((error) => {
        setResult(`Error: ${error.message}`);
      });
  }; */

  const handleLogin = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setResult('login!');
        } else {
          setResult('failed to login!');
        }
      })
      .catch((error) => {
        setResult(`Error: ${error.message}`);
      });
  };

}
export default App;
