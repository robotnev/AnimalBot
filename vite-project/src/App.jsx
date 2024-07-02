import './App.css'
import { useState } from 'react';
import './index.css';
import { PrismaClient } from '@prisma/client';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Define the schema for the users table
const userSchema = {
  username: {
    type: 'string',
    unique: true,
  },
  password: {
    type: 'string',
  },
};
// Create the users table in the database
await prisma.$create('users', userSchema);

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
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

  const handleCreate = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/create`, {
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
        } else {
          setResult('failed to create!');
        }
      })
      .catch((error) => {
        setResult(`Error: ${error.message}`);
      });
  };

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

  return (

    <div>
      <div>
        <label>user:</label>
        <input onChange={handleChangeUser} value={user}></input>
      </div>
      <div>
        <label>password:</label>
        <input onChange={handleChangePassword} value={password}></input>
      </div>
      <button onClick={handleCreate}>Create</button>
      <button onClick={handleLogin}>Login</button>
      <div>
        {result && <p>{result}</p>}
      </div>
    </div>
  );
}

export default App;
