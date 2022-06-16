import React, { useState, useContext } from 'react';
import ChatContext from '../context/ChatContext';
import {
  loginUser,
  getUserMessages,
  getUserContacts,
  getUserMostRecentMessagesFromContacts,
} from '../context/ChatActions';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
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
    dispatch({ type: 'LOGIN_USER', payload: login });
    //  retrieve user messages
    const userMessages = await (await getUserMessages(login.user_id)).json();
    dispatch({ type: 'GET_USER_MESSAGES', payload: userMessages });
    //  retrieve user contacts
    const contactsData = await (await getUserContacts(login.user_id)).json();
    dispatch({ type: 'GET_USER_CONTACTS', payload: contactsData });
    //  retrieve recent messages from each contact
    const contactMsgData = await (
      await getUserMostRecentMessagesFromContacts(login.user_id)
    ).json();
    dispatch({
      type: 'GET_RECENT_MESSAGES_FROM_CONTACTS',
      payload: contactMsgData,
    });
    //  redirect after data has been fetched
    navigate('/');
  };

  return (
    <>
      <div className="signupContainer">
        <header>
          <p className="pageHeader">Welcome back!</p>
          <p>Enter your username and password below to sign-in</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            className="emailInput"
            placeholder="Username"
            id="username"
            value={username}
            onChange={onChange}
          />

          <div className="passwordInputDiv">
            <input
              type={showPassword ? 'text' : 'password'}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt="Show Password"
              className="showPassword"
              onClick={() => setShowPassword(prevState => !prevState)}
            />
          </div>

          <div className="signInBar">
            <div id="signUpEmailPassword">
              <p className="signInText">Sign in</p>
              <button className="signInButton">
                <FaArrowRight fill="white" width="34px" height="34px" />
              </button>
            </div>

            <OAuth />
          </div>
        </form>

        <Link to="/sign-up" className="registerLink">
          Sign Up
        </Link>
      </div>
    </>
  );
}

export default SignIn;
