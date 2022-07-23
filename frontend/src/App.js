import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContextProvider } from './context/ChatContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatScreen from './pages/ChatScreen';
import Auth from './pages/Auth';

function App() {
  return (
    <ContextProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<ChatScreen />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </ContextProvider>
  );
}

export default App;
