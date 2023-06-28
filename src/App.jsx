import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context'
import { useSanctum } from 'react-sanctum';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Waterbody from './pages/Waterbody/Waterbody';
import Province from './pages/Province/Province';
import Login from './pages/Login/Login';

import ProtectedRoutes from './helpers/ProtectedRoutes';
import Dashboard from './pages/Admin/Dashboard';
import PersonalReports from './pages/Admin/PersonalReports/PersonalReports';
import Provinces from './pages/Admin/Provinces/Provinces';
import AdminProvince from './pages/Admin/Provinces/AdminProvince';
import UnlistedWaterbodiesTable from './components/admin/UnlistedWaterbodiesTable';
import ProvinceWeeklyReport from './components/admin/ProvinceWeeklyReport';
import ProvinceWaterbodyWeeklyReports from './pages/Admin/WeeklyReports/ProvinceWaterbodyWeeklyReports';
import UnapprovedPersonalReports from './pages/Admin/PersonalReports/UnapprovedPersonalReports';

const App = () => {
  const { authenticated, user, signIn, signOut } = useSanctum();
  return (
    <>
      <AppProvider>
        <BrowserRouter>

          <Header isAdmin={authenticated} signOut={signOut} />

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path='/dashboard' element={<Dashboard user={user} />} />
              <Route path='/dashboard/reports' element={<PersonalReports user={user} />} />
              <Route path='/dashboard/unapproved_reports' element={<UnapprovedPersonalReports user={user} />} />
              <Route path='/dashboard/provinces/' element={<Provinces user={user} />} />
              <Route path='/dashboard/provinces/:adminProvinceId' element={<AdminProvince user={user} />} />
              <Route path='/dashboard/province_weekly_report/:adminProvinceId' element={<ProvinceWeeklyReport user={user} />} />
              <Route path='/dashboard/waterbodies/:waterbodyId/weekly_reports' element={<ProvinceWaterbodyWeeklyReports user={user} />} />
              <Route path='/dashboard/unlisted_waterbodies' element={<UnlistedWaterbodiesTable user={user} />} />
            </Route>

            <Route path="/" element={<Home />} />
            <Route path="/waterbodies/:waterbody_id" element={<Waterbody />} />
            <Route path="/provinces/:province_id" element={<Province />} />
          </Routes>

          <Footer />

        </BrowserRouter>
      </AppProvider>


    </>
  );
};

export default App;
