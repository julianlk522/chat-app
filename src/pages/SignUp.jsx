import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ChatContext from '../context/ChatContext';
import { createNewUser } from '../context/ChatActions';
import { FaArrowRight } from 'react-icons/fa';
import visibilityIcon from '../assets/visibilityIcon.svg';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });

  const { name, username, password } = formData;

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
    //  sign up user, retrieve new id
    const newUserData = await (await await createNewUser(formData)).json();
    //  remove username, set logged-in user to new user data
    const { user_id, name } = newUserData;
    // dispatch({ type: 'SET_USER', payload: { user_id, name } });
    //  set localstorage
    localStorage.setItem('user', JSON.stringify({ user_id, name }));
    //  redirect after setting user
    navigate('/');
  };

  return (
    <>
      <div className="flex flex-col text-center px-8">
        <header>
          <p id="header" className="text-4xl font-extrabold m-12 mb-4">
            Welcome!
          </p>
          <p>Fill out the form below to sign up and start chatting</p>
        </header>

        <form onSubmit={onSubmit} className="flex flex-col">
          <input
            className="shadow-md border-none bg-slate-200 rounded-2xl h-12 w-full outline-none px-12 my-8"
            placeholder="Name"
            id="name"
            value={name}
            onChange={onChange}
          />

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

          <div className="flex flex-col justify-evenly items-center my-8">
            <p className="cursor-pointer text-2xl font-bold">
              {name.length >= 6 && password.length >= 6
                ? 'Sign Up!'
                : 'Sign up (requires valid name, username and password)'}
            </p>
            <button className="cursor-pointer mt-4 flex justify-center items-center w-12 h-12 bg-sky-500 rounded-full border-2 border-slate-300">
              <FaArrowRight fill="white" width="2rem" height="2rem" />
            </button>
          </div>
        </form>

        <Link
          to="/sign-in"
          className="text-sky-500 font-semibold text-center flex justify-center items-center mt-16"
        >
          Take me to Sign In instead
        </Link>
      </div>
    </>
  );
}

export default SignUp;
