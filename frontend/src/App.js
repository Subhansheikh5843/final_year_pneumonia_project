import './App.css';
import { Routes,Route, Navigate} from 'react-router-dom';
import Pneumonia from './components/Screens/Pneumonia';
import GetPneumonia from './components/Screens/GetPneumonia';
import Header from './components/Header';

import Login from './components/Screens/Login';
import Register from './components/Screens/Register';
import ChangePassword from './components/Screens/ChangePassword';
import ResetPassword from './components/Screens/ResetPassword';
import SendEmail from './components/Screens/SendEmail';
import { useSelector } from 'react-redux';
import ChatBot from './components/Screens/chatbot';
import Footer from './components/Footer';
import Home from './components/Screens/Home';
import AboutPage from './components/Screens/AboutPage';
import ContactPage from './components/Screens/ContactPage';
function App() {
  const { userInfo, loading, error } = useSelector((state) => state.userLogin);

  return (
    <>
    <Header />

<Routes>
<Route 
          path='/pneumonia' 
          element={userInfo ? <Pneumonia /> : <Navigate to="/login" replace />} 
        />
<Route 
          path='/' 
          element={userInfo ? <Home /> : <Navigate to="/login" replace />} 
        />
<Route 
          path='/contact' 
          element={userInfo ? <ContactPage /> : <Navigate to="/login" replace />} 
        />
<Route 
          path='/about' 
          element={userInfo ? <AboutPage /> : <Navigate to="/login" replace />} 
        />

<Route 
          path='/chatbot' 
          element={userInfo ? <ChatBot />: <Navigate to="/login" replace />} 
        />

        <Route 
          path='/get-pneumonia-records' 
          element={userInfo ? <GetPneumonia /> : <Navigate to="/login" replace />} 
        />
       

  <Route path='/login' element={<Login />} />
  <Route path='/register' element={<Register />} />
  <Route path="/api/user/reset/:uidb64/:token" element={<ResetPassword />} />
  <Route path="/send-reset-password-email" element={<SendEmail />} />
  <Route path='/change-password' element={<ChangePassword />} />
</Routes>
<Footer />

    </>
  );
}

export default App;

