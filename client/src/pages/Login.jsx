import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      document.cookie = `token=${response.data.token}; path=/`;
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
};

const handleGoogleSubmit=async(e)=>{
    e.preventDefault();
    try{
        window.location.href='http://localhost:5000/api/auth/google';
    }
    catch(err){
        console.log(err,'handle google submit');
    }
}
// const handleFacebookSubmit=async(e)=>{
//   e.preventDefault();
//   try{
//       window.location.href='http://localhost:5000/api/auth/google';
//   }
//   catch(err){
//       console.log(err,'handle google submit');
//   }
// }


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <button onClick={handleGoogleSubmit}>google</button>
      </div>
    </div>
  );
};

export default Login;
