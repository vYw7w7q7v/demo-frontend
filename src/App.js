import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import MainPage from './pages/main_page/MainPage';
import InfoPage from './pages/info_page/InfoPage';
import Footer from './components/footer/Footer';
import Invitation from "./pages/invitation/Invitation";
import MyAccount from "./pages/my_account/MyAccount";
import EventSelection from "./pages/event_selection/EventSelection";
import {AuthProvider} from "./context/AuthContext";
import AccountSettings from "./pages/account_settings/AccountSettings";
import {CloseEventProvider} from "./context/event/CloseEventContext";
import MyEvent from "./pages/my_event/MyEvent";
import QrCode from "./pages/qr_code_page/QrCode";
import {ApiProvider} from "./context/api/ApiContext";
import Confirm from "./pages/confirm/Confirm";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ApiProvider>
          <CloseEventProvider>
            <div>
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
          <Routes>
            <Route path="/info" element={<InfoPage />} />
          </Routes>
          <Routes>
            <Route path="/invite" element={<Invitation />} />
          </Routes>
          <Routes>
            <Route path="/confirm-page" element={<Confirm />} />
          </Routes>
          <Routes>
            <Route path="/selection-event" element={<EventSelection />} />
          </Routes>
          <Routes>
            <Route path="/my-event" element={<MyEvent />} />
          </Routes>
          <Routes>
            <Route path="/account" element={<MyAccount />} />
          </Routes>
          <Routes>
            <Route path="/account-settings" element={<AccountSettings />} />
          </Routes>
          <Routes>
            <Route path="/invitation" element={<QrCode />} />
          </Routes>
          {/*<Footer />*/}
        </div>
        </CloseEventProvider>
        </ApiProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
