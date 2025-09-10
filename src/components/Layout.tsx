import { useEffect } from 'react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import BrandPromotion from './BrandPromotion';
import CartButtonBig from './cart/CartButtonBig';
import Modal from './Modal';
import { CartPanel } from './cart';
import MobileHeader from './mobile/MobileHeader';
import BottomNavbar from './mobile/BottomNavbar';
import { useAppSelector } from '../hooks/useAppSelector';

type Props = {
  noFooter?: boolean;
  component: React.ReactElement;
};

const Layout = ({ noFooter, component }: Props) => {
  const modalShown = useAppSelector((state) => state.modal.visible);
  const cartShown = useAppSelector((state) => state.ui.cartPanel);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [component]);



  return (
    <>
      <div>
        <Header />
        <MobileHeader />
        <main className="pt-16 md:pt-24 pb-20 md:pb-0">{component}</main>
        {!noFooter && (
          <>
            <BrandPromotion />
            <Footer />
          </>
        )}
        <CartButtonBig />

      </div>
      {cartShown && <CartPanel />}
      {modalShown && <Modal />}
    </>
  );
};

export default Layout;
