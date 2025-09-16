import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import AppWithRouting from './Routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BottomNavbar from './components/mobile/BottomNavbar';
import { useAppDispatch, useAppSelector } from './hooks';
import { verifyToken } from './store/auth';
import { cookieUtils } from './utils/cookies';
import Login from './pages/Login';
import LoginLayout from './components/LoginLayout';

function App() {
  const dispatch = useAppDispatch();
  const { user, token, isVerifying } = useAppSelector(state => state.auth);

  useEffect(() => {
    const savedToken = cookieUtils.getToken();
    if (savedToken) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

  if (isVerifying) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Allow access to all pages without authentication for now
  // if (!token || !user) {
  //   return (
  //     <BrowserRouter>
  //       <LoginLayout component={<Login />} />
  //       <ToastContainer
  //         position="top-right"
  //         autoClose={3000}
  //         hideProgressBar={false}
  //         closeOnClick
  //         draggable
  //         pauseOnHover
  //       />
  //     </BrowserRouter>
  //   );
  // }

  return (
    <BrowserRouter>
      <AppWithRouting />
      <BottomNavbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
