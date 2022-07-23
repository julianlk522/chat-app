import React, { useState, useContext, useEffect } from 'react';
import ChatContext from '../context/ChatContext';
import { createNewUser, loginUser } from '../context/ChatActions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowRight } from 'react-icons/fa';
import visibilityIcon from '../assets/visibilityIcon.svg';

function SignIn() {
  const toastOptions = {
    autoClose: 4000,
    position: toast.POSITION.BOTTOM_RIGHT,
  };

  const navigate = useNavigate();
  const { dispatch } = useContext(ChatContext);

  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });
  const [readyForSubmit, setReadyForSubmit] = useState(false);

  const { name, username, password } = formData;

  const onInputChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    checkReadyForSubmit();
    // eslint-disable-next-line
  }, [isSignUp, onInputChange]);

  const checkReadyForSubmit = () => {
    console.log('checking');
    if (username.length >= 6 && password.length >= 6) {
      if (!isSignUp) {
        console.log('sign in with 6u and 6p');
        return setReadyForSubmit(true);
      } else if (name.length <= 3) {
        console.log('sign up with 3n or less');
        return setReadyForSubmit(false);
      } else {
        console.log('sign up and enough of all');
        return setReadyForSubmit(true);
      }
    } else {
      console.log('u or p not long enough');
      setReadyForSubmit(false);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    dispatch({ type: 'SET_LOADING' });

    if (isSignUp) {
      const signUpData = await createNewUser(formData);
      if (signUpData.error) {
        toast.error(`Error: ${signUpData.error}`, toastOptions);
      } else {
        localStorage.setItem('chatUser', JSON.stringify(signUpData));
      }
    } else {
      const loginData = await loginUser({ username, password });

      if (loginData.error) {
        toast.error(`Error: ${loginData.error}`, toastOptions);
      } else {
        localStorage.setItem('chatUser', JSON.stringify(loginData));
      }
    }
    navigate('/');
  };

  return (
    <>
      <div
        id="bgWrapperMask"
        className="bg-black h-full w-full z-[-1] fixed opacity-60"
      ></div>
      <div
        // bg image source: Priscilla Du Preez https://unsplash.com/photos/sOdldNCQEtU
        id="bgWrapper"
        className="bg-authBg bg-auto h-full w-full z-[-2] fixed opacity-40"
      ></div>
      <div className="flex flex-col h-full text-center px-8 bg-slate-100 bg-opacity-25 mx-60">
        <header>
          <p id="header" className="text-4xl text-white font-extrabold m-12">
            {isSignUp ? 'Welcome!' : 'Welcome back!'}
          </p>
          <p className="text-white my-4">
            {isSignUp
              ? 'Fill out the form below to sign up and start chatting'
              : 'Enter your username and password below to sign-in'}
          </p>
        </header>

        <form onSubmit={onSubmit}>
          {isSignUp && (
            <input
              className="shadow-md border-none bg-slate-200 rounded-2xl h-12 w-full outline-none px-12 my-8"
              placeholder="Name"
              id="name"
              value={name}
              onChange={onInputChange}
            />
          )}

          <input
            className="shadow-md border-none bg-slate-200 rounded-2xl h-12 w-full outline-none px-12 my-8"
            placeholder="Username"
            id="username"
            value={username}
            onChange={onInputChange}
          />

          <div id="passwordDiv" className="flex items-center relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="shadow-md border-none bg-slate-200 rounded-2xl h-12 w-full outline-none px-12 my-8"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onInputChange}
            />

            <img
              src={visibilityIcon}
              alt="Show Password"
              className="cursor-pointer absolute p-4 right-8"
              onClick={() => setShowPassword(prevState => !prevState)}
            />
          </div>

          <div className="flex justify-evenly items-center my-8">
            <p className="text-2xl text-sky-500 font-bold">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </p>
            <button
              className={`flex justify-center items-center w-12 h-12 rounded-full border-2 border-slate-200 border-opacity-50 ${
                readyForSubmit
                  ? 'bg-sky-500 cursor-pointer hover:scale-110'
                  : 'bg-slate-300'
              }`}
              disabled={!readyForSubmit}
            >
              <FaArrowRight fill="white" width="2rem" height="2rem" />
            </button>
          </div>
        </form>

        <div
          id="relocateButtonDiv"
          className="flex justify-center items-center"
        >
          <button
            id="relocateButton"
            className="bg-white bg-opacity-10 rounded-2xl p-2 border-slate-200 border-2 border-opacity-25 hover:scale-110"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            <p className="text-slate-200 text-sm font-semibold m-2">
              {`Take me to ${isSignUp ? 'Sign In' : 'Sign Up'} instead`}
            </p>
          </button>
        </div>
      </div>
    </>
  );
}

export default SignIn;
