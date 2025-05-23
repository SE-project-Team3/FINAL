import { Routes, Route, useLocation } from 'react-router-dom';
import AuthHeader from './layout/AuthHeader';
import MainHeader from './layout/MainHeader';
import Footer from './layout/Footer';

import SignUpPage from './pages/login/SignUpPage';
import LoginPage from './pages/login/LoginPage';
import HomePage from './pages/home/HomePage';
import InfoPage from './pages/home/InfoPage';
import ViewTable from './pages/reservation/ViewTable';
import ReservationForm from './pages/reservation/ReservationForm';
import MyReservations from './pages/inform/MyReservations';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/signup';

  return (
    <>
      {isAuthPage ? <AuthHeader /> : <MainHeader />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/view-table" element={<ViewTable />} />
        <Route path="/reservation-form" element={<ReservationForm />} />
        <Route path="/my-reservations" element={<MyReservations />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;
