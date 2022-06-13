import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth'
import {FaArrowRight} from 'react-icons/fa'
import visibilityIcon from '../assets/visibilityIcon.svg'

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      name: ''
    })

    const {email, password, name} = formData

    const navigate = useNavigate()
  
    const onChange = (event) => {
      setFormData((prevState) => ({
        ...prevState,
        [event.target.id]: event.target.value
      }))
    }

    const onSubmit = () => {
      console.log('submitted')
    }
    
    return (
        <>
          <div className="signupContainer">
            <header>
              <p className="pageHeader">Welcome!</p>
              <p>Fill out the form below to sign up and start chatting</p>

            </header>

            <form onSubmit={onSubmit}>
              <input 
                type='email' 
                className='emailInput'
                placeholder='Email'
                id='email'
                value={email}
                onChange = {onChange}
              />

              <input 
                type='text' 
                className='nameInput'
                placeholder='Name'
                id='name'
                value={name}
                onChange = {onChange}
              />

              <div className="passwordInputDiv">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className='passwordInput'
                  placeholder='Password'
                  id='password'
                  value={password}
                  onChange={onChange}
                />

                <img src={visibilityIcon} alt="Show Password" className="showPassword" onClick={() => setShowPassword((prevState) => !prevState)}/>
              </div>

              <div className="signUpBar">
                <div id="signUpEmailPassword">
                  <p className="signUpText">
                    {name.length >=7 && password.length >= 7 ? "Sign Up!" : "Sign up (requires valid email, name and password)"}
                  </p>
                  <button className="signUpButton">
                    <FaArrowRight fill='white' width='34px' height='34px'/>
                  </button>
                </div>

                <OAuth />
              </div>
            </form>
            
            <Link to='/sign-in' className='registerLink'>
              Sign In
            </Link>
          </div>
        </>
    )
}

export default SignUp