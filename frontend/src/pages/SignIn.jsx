import React, { useState, useContext, useEffect } from 'react';
import ChatContext from '../context/ChatContext';
import { loginUser } from '../context/ChatActions';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowRight } from 'react-icons/fa';
import visibilityIcon from '../assets/visibilityIcon.svg';

function SignIn() {
  const toastOptions = {
    autoClose: 4000,
    position: toast.POSITION.BOTTOM_RIGHT,
  };

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
    const loginData = await loginUser(formData);
    //  if error show user a toast
    if (loginData.error) {
      toast.error(`Error: ${loginData.error}`, toastOptions);
    } //  set localstorage if successful login
    else {
      localStorage.setItem('chatUser', JSON.stringify(loginData));
      navigate('/');
    }
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
            Welcome back!
          </p>
          <p className="text-white my-4">
            Enter your username and password below to sign-in
          </p>
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
            <p className="text-2xl text-sky-500 font-bold">Sign in</p>
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

        <div id="signUpDiv" className="flex justify-center items-center ">
          <button
            id="signUpLink"
            className="bg-white bg-opacity-10 rounded-2xl p-2 border-slate-200 border-2 border-opacity-25 hover:scale-110"
          >
            <Link
              to="/sign-up"
              className="max-w-[50%] text-slate-200 text-sm font-semibold mt-20"
            >
              Take me to Sign Up instead
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}

export default SignIn;
