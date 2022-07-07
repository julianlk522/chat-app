import React, { useState, useContext, useEffect } from 'react';
import ChatContext from '../context/ChatContext';
import { loginUser } from '../context/ChatActions';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import visibilityIcon from '../assets/visibilityIcon.svg';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  //  submit disabled state
  const [readyForSubmit, setReadyForSubmit] = useState(false);

  //  check for submit disabled on username/password change
  useEffect(() => {
    const checkReadyForSubmit = () => {
      if (username.length >= 6 && password.length >= 6) {
        setReadyForSubmit(true);
      } else setReadyForSubmit(false);
    };
    checkReadyForSubmit();
  }, [username.length, password.length]);

  const navigate = useNavigate();
  const { dispatch } = useContext(ChatContext);

  const onChange = event => {
    setFormData(prevState => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    dispatch({ type: 'SET_LOADING' });
    //  log in user, retrieve id
    const login = await loginUser(formData);
    const loginInfo = await login.json();
    //  set localstorage
    localStorage.setItem('chatUser', JSON.stringify(loginInfo));
    navigate('/');
  };

  return (
    <>
      <div className="flex flex-col text-center px-8">
        <header>
          <p id="header" className="text-4xl font-extrabold m-12 mb-4">
            Welcome back!
          </p>
          <p>Enter your username and password below to sign-in</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            className="shadow-md border-none bg-slate-200 rounded-2xl h-12 w-full outline-none px-12 my-8"
            placeholder="Username"
            id="username"
            value={username}
            onChange={onChange}
          />

          <div id="passwordDiv" className="flex items-center relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="shadow-md border-none bg-slate-200 rounded-2xl h-12 w-full outline-none px-12 my-8"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt="Show Password"
              className="cursor-pointer absolute p-4 right-8"
              onClick={() => setShowPassword(prevState => !prevState)}
            />
          </div>

          <div className="flex justify-evenly items-center my-8">
            <p className="text-2xl font-bold">Sign in</p>
            <button
              className={`flex justify-center items-center w-12 h-12 rounded-full border-2 border-slate-200 ${
                readyForSubmit ? 'bg-sky-500 cursor-pointer' : 'bg-slate-300'
              }`}
              disabled={!readyForSubmit}
            >
              <FaArrowRight fill="white" width="2rem" height="2rem" />
            </button>
          </div>
        </form>

        <Link
          to="/sign-up"
          className="text-sky-500 font-semibold text-center flex justify-center items-center mt-20"
        >
          Take me to Sign Up instead
        </Link>
      </div>
    </>
  );
}

export default SignIn;
