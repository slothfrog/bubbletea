import './App.css';
import Menu from './Menu/Menu';
import Checkout from './Checkout/Checkout';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './shared/NavBar/NavBar';
import Location from './Location/Location';
import Contact from './Contact/Contact';
import SignIn from './Login/SignIn/SignIn';
import SignUp from './Login/SignUp/SignUp';
import Success from './Checkout/InfoPage/Success/Success';
import Error from './Checkout/InfoPage/Error/Error';
import ContactSuccess from './Contact/ContactSuccess';
import ContactError from './Contact/ContactError';
import { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { getIsAuthenticated, logoutUser } from './api/LoginAPI';
import { useEffect } from 'react';

function App() {
  const { data: userData, refetch, error, loading } = useQuery(getIsAuthenticated, { errorPolicy: 'ignore' });
  const [logout] = useLazyQuery(logoutUser, {
    onCompleted: () => {
      window.location.reload(false)
    }
  });
  const [update, setUpdate] = useState(true)
  
  useEffect(() => {
      if(update) {
          refetch()
          setUpdate(false)
      }
  }, [refetch, update])

  const onLogin = () => {
    setUpdate(true);
  }

  const onLogout = () => {
    logout();
  }
  
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar update={update} onLogout={onLogout} load={loading} user={userData} error={error}></NavBar>
        <Routes>
          <Route exact path="/" element={<Menu/>} />
          <Route path="/checkout" element={<Checkout user={userData}/>} />
          <Route path="/locations" element={<Location/>} />
          <Route path="/contact-us" element={<Contact></Contact>} />
          <Route path="/sign-in" element={<SignIn onLogin={onLogin}/>}/>
          <Route path="/sign-up" element={<SignUp onLogin={onLogin}/>}/>
          <Route path="/success/:orderId" element={<Success />}/>
          <Route path="/error/:orderId" element={<Error />}/>
          <Route path="/contact/success" element={<ContactSuccess/>}/>
          <Route path="/contact/error" element={<ContactError/>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
