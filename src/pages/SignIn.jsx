import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth'
import {FaArrowRight} from 'react-icons/fa'
import visibilityIcon from '../assets/visibilityIcon.svg'

function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    })

    const {email, password} = formData

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
              <p className="pageHeader">Welcome back!</p>
              <p>Enter your email and password below to sign-in</p>

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

              <div className="signInBar">
                <div id="signUpEmailPassword">
                  <p className="signInText">
                    Sign in
                  </p>
                  <button className="signInButton">
                    <FaArrowRight fill='white' width='34px' height='34px'/>
                  </button>
                </div>

                <OAuth />
              </div>
            </form>
            
            <Link to='/sign-up' className='registerLink'>
              Sign Up
            </Link>
          </div>
        </>
    )
}

export default SignIn