import React, { useState, useContext } from 'react';
import ChatContext from '../context/ChatContext';
import {
  loginUser,
  getUserMessages,
  getUserContacts,
  getUserMostRecentMessagesFromContacts,
} from '../context/ChatActions';
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
    const login = await (await loginUser(formData)).json();
    //  reduce login info to user state data
    const { user_id, name } = login;
    //  retrieve user messages
    const userMessages = await (await getUserMessages(user_id)).json();
    dispatch({ type: 'GET_USER_MESSAGES', payload: userMessages });
    //  retrieve user contacts
    const contactsData = await (await getUserContacts(user_id)).json();
    dispatch({ type: 'GET_USER_CONTACTS', payload: contactsData });
    //  retrieve recent messages from each contact
    const contactMsgData = await (
      await getUserMostRecentMessagesFromContacts(user_id)
    ).json();
    dispatch({
      type: 'GET_RECENT_MESSAGES_FROM_CONTACTS',
      payload: contactMsgData,
    });
    //  set localstorage
    localStorage.setItem('user', JSON.stringify({ user_id, name }));
    //  redirect after data has been fetched
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
            <p className="cursor-pointer text-2xl font-bold">Sign in</p>
            <button className="cursor-pointer flex justify-center items-center w-12 h-12 bg-sky-500 rounded-full border-2 border-slate-200">
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
