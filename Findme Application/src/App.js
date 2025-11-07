import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemList from './components/ItemList';
import LandingPage from './components/LandingPage';
import UserLoginPage from './components/UserLoginPage';
import CitizenLoginPage from './components/CitizenLoginPage'; 
import AdminLoginPage from './components/AdminLoginPage';
import PoliceLoginPage from './components/PoliceLoginPage';  
import CitizenHomeWidget from './components/CitizenHomeWidget';
import AdminHomeWidget from './components/AdminHomeWidget';
import RegisterPage from './components/RegisterPage'; 
import DisplayPage from './components/DisplayPage';
import PoliceHomeWidget from './components/PoliceHomeWidget';
import Terms from './components/Terms'; 
import Privacy from './components/Privacy';
import ResetPassword from './components/ResetPassword'
import PasswordUpdate from './components/PasswordUpdate';
import ReportMissingPerson from './components/ReportMissingPerson';
import ReportUnidentifiedPersonPage from './components/ReportUnidentifiedPersonPage';
import LogOUtConfirmation from './components/LogOutConfirmation'; 
import ManageUserPasswords from './components/ManageUserPasswords';
import ReportedCases from './components/ReportedCases'
import HelpAndFAQs from './components/HelpAndFAQs';
import NotificationsPage from './components/NotificationsPage';
import UserManagement from './components/UserManagement';
import ViewCases from './components/ViewCases';
import ViewUPcases from './components/ViewUPcases';
import FeedbackPage from './components/FeedbackPage';
import AnalyticsPage from "./components/AnalyticsPage";
import GeneralRecords from "./components/GeneralRecords";
import MissingPersonsPage from "./components/MissingPersonsPage";
import UnidentifiedPersonsPage from "./components/UnidentifiedPersonsPage";
import PossibbleMatchesPage from "./components/PossibleMatchesPage";
import Leads from "./components/Leads";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/UserloginPage" element={<UserLoginPage />} />
          <Route path="/AdminloginPage" element={<AdminLoginPage />} />
          <Route path="/policeloginPage" element={<PoliceLoginPage />} />
          <Route path="/CitizenloginPage" element={<CitizenLoginPage />} />
          <Route path="/CitizenHomeWidget" element={<CitizenHomeWidget />} />
          <Route path="/AdminHomeWidget" element={<AdminHomeWidget />} />
          <Route path="/AdminHomeWidget/feedbacks" element={<FeedbackPage />} />
          <Route path="/register" element={<RegisterPage />} /> 
          <Route path="/display" element={<DisplayPage />} />
          <Route path="/PoliceHomewidget" element={<PoliceHomeWidget/>} />
          <Route path="/terms" element={<Terms />} /> 
          <Route path="/privacy" element={<Privacy />} /> 
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/password-update" element={<PasswordUpdate />} />
          <Route path="/report-missing-person" element={<ReportMissingPerson />} />
          <Route path="/report" element={<ReportUnidentifiedPersonPage />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/logout-confirmation" element={<LogOUtConfirmation />} />
          <Route path="/ManageUserPasswords" element={<ManageUserPasswords />} />
          <Route path="/ReportedCases" element={< ReportedCases />} />
          <Route path="/help" element={<HelpAndFAQs />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/AdminHomeWidget/users" element={<UserManagement />} />
          <Route path="/PoliceHomeWidget/ViewCases" element={<ViewCases />} />
          <Route path="/PoliceHomeWidget/ViewUPcases" element={<ViewUPcases />} />
          <Route path="/PoliceHomeWidget/Analytics" element={<AnalyticsPage />} />
          <Route path="/PoliceHomeWidget/Reports" element={<GeneralRecords/>} />
          <Route path="/leads" element={<Leads/>} />
          <Route path="/missing-persons" element={<MissingPersonsPage/>} />
          <Route path="/unidentified-persons" element={<UnidentifiedPersonsPage/>} />
          <Route path="/matches" element={<PossibbleMatchesPage/>} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
