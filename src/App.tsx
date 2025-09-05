import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import AppWithRouting from './Routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BottomNavbar from './components/mobile/BottomNavbar';
import { useAppDispatch } from './hooks/useAppDispatch';
import { verifyToken } from './store/auth';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

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
