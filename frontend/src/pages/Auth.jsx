import React, { useState, useContext, useEffect } from 'react';
import ChatContext from '../context/ChatContext';
import { createNewUser, loginUser } from '../context/ChatActions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowRight } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import visibilityIcon from '../assets/visibilityIcon.svg';

function Auth() {
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
    if (username.length >= 6 && password.length >= 6) {
      if (!isSignUp) {
        return setReadyForSubmit(true);
      } else if (name.length <= 3) {
        return setReadyForSubmit(false);
      } else {
        return setReadyForSubmit(true);
      }
    } else {
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
        id="bgImgMask"
        className="bg-gradient-to-b from-slate-400 to-black h-full w-full z-[-1] fixed opacity-75"
      ></div>
      <div
        // bg image source: Priscilla Du Preez https://unsplash.com/photos/sOdldNCQEtU
        id="bgImg"
        className="bg-authBg bg-auto h-full w-full z-[-2] fixed opacity-40"
      ></div>
      <div className="flex flex-col justify-evenly h-full text-center px-8 bg-slate-100 bg-opacity-25 mx-48">
        <header>
          <p id="header" className="text-6xl text-white font-extrabold m-12">
            {isSignUp ? 'Welcome!' : 'Welcome back!'}
          </p>
          <p className="text-white text-xl my-4">
            {isSignUp
              ? 'Enter your name, username and password below to sign up and start chatting'
              : 'Enter your username and password below to sign-in'}
          </p>
        </header>

        <form onSubmit={onSubmit}>
          {isSignUp && (
            <input
              autoComplete="off"
              className="shadow-md border-none bg-slate-200 rounded-2xl h-12 w-full outline-none px-12 my-8"
              placeholder="Name"
              id="name"
              value={name}
              onChange={onInputChange}
            />
          )}

          <input
            autoComplete="off"
            className="shadow-md border-none bg-slate-200 rounded-2xl h-12 w-full outline-none px-12 my-8"
            placeholder="Username"
            id="username"
            value={username}
            onChange={onInputChange}
          />

          <div id="passwordDiv" className="flex items-center relative">
            <input
              autoComplete="off"
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

          <div
            id="actionsDiv"
            className="flex justify-evenly items-center my-8"
          >
            <button
              type="submit"
              className={`flex justify-evenly items-center  bg-white bg-opacity-10 rounded-2xl p-2 border-slate-200 border-2 border-opacity-25 ${
                readyForSubmit && 'cursor-pointer hover:scale-110'
              }`}
              disabled={!readyForSubmit}
            >
              <p
                className={`font-bold ${
                  readyForSubmit
                    ? 'text-lime-500 text-4xl'
                    : 'text-slate-200 text-2xl'
                }`}
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </p>
              {readyForSubmit ? (
                <FaArrowRight
                  fill="white"
                  className="ml-4 w-8 h-8 rounded-full bg-opacity-50 bg-lime-500 border-2 border-slate-200 border-opacity-25"
                />
              ) : (
                <FcCancel fill="red" className="ml-4 w-8 h-8 rounded-full" />
              )}
            </button>
            <button
              type="button"
              id="relocateButton"
              className="bg-white bg-opacity-10 rounded-2xl p-2 border-slate-200 border-2 border-opacity-25 hover:scale-110"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              <p className="text-slate-200 text-sm font-semibold m-2">
                {`Take me to ${isSignUp ? 'Sign In' : 'Sign Up'} instead`}
              </p>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Auth;
