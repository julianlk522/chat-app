import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ChatContext from '../context/ChatContext';
import { createNewUser } from '../context/ChatActions';
import OAuth from '../components/OAuth';
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
      <div className="signupContainer">
        <header>
          <p className="pageHeader">Welcome!</p>
          <p>Fill out the form below to sign up and start chatting</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="Name"
            id="name"
            value={name}
            onChange={onChange}
          />

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

          <div className="signUpBar">
            <div id="signUpEmailPassword">
              <p className="signUpText">
                {name.length >= 6 && password.length >= 6
                  ? 'Sign Up!'
                  : 'Sign up (requires valid name, username and password)'}
              </p>
              <button className="signUpButton">
                <FaArrowRight fill="white" width="34px" height="34px" />
              </button>
            </div>

            <OAuth />
          </div>
        </form>

        <Link to="/sign-in" className="registerLink">
          Sign In
        </Link>
      </div>
    </>
  );
}

export default SignUp;
