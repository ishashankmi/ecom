import { useEffect } from 'react';
import Header from './shared/Header';
import MobileHeader from './mobile/MobileHeader';
import BottomNavbar from './mobile/BottomNavbar';
import { useAppSelector } from '../hooks/useAppSelector';

type Props = {
  component: React.ReactElement;
};

const LoginLayout = ({ component }: Props) => {
  const modalShown = useAppSelector((state) => state.modal.visible);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col">
        <Header />
        <MobileHeader />
        <main className="flex-1 overflow-hidden">{component}</main>

      </div>
    </>
  );
};

export default LoginLayout;