import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginimage from '../Assets/loginimage.png';
import { HiOutlineUser, HiOutlineLockClosed } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import image1 from '../Assets/Iron_shop-logo.png';

const LoginDash = () => {
  const [UserName, setUserName] = useState('');
  const [Password, setPassword] = useState('');
  const [UserNameError, setUserNameError] = useState('');
  const [PasswordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    let isValid = true;

    // Validate username
    if (!UserName.trim()) {
      setUserNameError('Please enter a username');
      isValid = false;
    } else {
      setUserNameError('');
    }

    // Validate password
    if (!Password.trim()) {
      setPasswordError('Please enter a password');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  // Frontend code
const handleLogin = async () => {
  console.log('Logging in...');
  if (!validateInputs()) {
    return;
  }

  try {
    // Perform authentication logic here
    const response = await fetch('http://localhost:3001/api/auth/login', {
      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({ UserName, Password }),
    });
    console.log("ok");
    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    // Authentication successful, navigate to the appropriate dashboard
    const { UserType } = await response.json();
    console.log(UserType);

    switch (UserType) {
      case 'Owner':
        navigate('/showroom-dashboard');
        break;
      case 'Supervisor':
        navigate('/warehouse-dashboard');
        break;
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'supplier':
        navigate('/supplier-dashboard');
        break;
      default:
        navigate('*');
        break;
    }
  } catch (error) {
    console.error('Authentication error:', error.message);
    setUserNameError('Invalid username or password');
    setPasswordError('Invalid username or password');
  }
};

  return (
    <div className="relative h-screen">
      <div className="flex h-full">
        <div className="w-2/3">
          <img src={loginimage} alt="LoginImage" className="w-full h-full object-cover" />
        </div>
        <div className="w-1/3 bg-white rounded-3xl py-8 px-10 shadow-md flex flex-col justify-center">
          <div className="mb-6 text-center">
            <img src={image1} alt="Logo" className="w-40 h-auto mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
          <div className="mb-6 relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineUser className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="UserName"
                className={`w-full pl-10 pr-4 py-2 border rounded-3xl focus:outline-none ${UserNameError ? 'border-red-500' : 'border-gray-300'}`}
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            {UserNameError && <p className="text-red-500 text-sm  mt-1">{UserNameError}</p>}
          </div>
          <div className="mb-6 relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineLockClosed className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                className={`w-full pl-10 pr-4 py-2 border rounded-3xl focus:outline-none ${PasswordError ? 'border-red-500' : 'border-gray-300'}`}
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              </div>
              {PasswordError && <p className="text-red-500 text-sm mt-1">{PasswordError}</p>}
          </div>
          <button
            className="w-full text-sm text-white py-4 rounded-3xl bg-black mt-4"
            onClick={handleLogin}
          >
            Login to Continue
          </button>
          <button className="w-full text-sm text-white py-4 rounded-3xl bg-black mt-4" >
            <Link to="/catalogue">View Catalogue</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginDash;
