import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContextProvider } from './context/ChatContext';
import { ToastContainer } from 'react-toastify';
import ChatScreen from './pages/ChatScreen';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

function App() {
  
  return (
      <ContextProvider>
        <Router>
          <Routes>
            <Route path='/' element={<ChatScreen />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/sign-in' element={<SignIn />} />
          </Routes>
        </Router>
        <ToastContainer />
      </ContextProvider>
  );
}

export default App;
