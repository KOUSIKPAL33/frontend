import './App.css'
import Yummpy from './pages/Yummpy'
import Dominos from './pages/Dominos'
import Kathijunction from './pages/Kathijunction'
import Home from './screens/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Mycart from './components/Mycart'
import { ToastContainer } from 'react-toastify'
import Checkout from './components/Checkout'
import AdminHome from './admin/AdminHome'
import Myorders from './components/Myorders'
import Contactus from "./pages/Contactus"
import Profile from './components/Profile'

import DashboardWrapper from './admin/DashboardWrapper';
import ShowdataWrapper from './admin/ShowdataWrapper';
import ShowOrdersWrapper from './admin/ShowOrdersWrapper';

function App() {
  const token = localStorage.getItem("authToken");
  return (
    <>
      <ToastContainer />
      <Router>
        <div>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/yummpy' element={<Yummpy />} />
            <Route exact path='/dominos' element={<Dominos />} />
            <Route exact path='/kathijunction' element={<Kathijunction />} />
            <Route exact path='/Mycart' element={token ? <Mycart /> : <Home />} />
            <Route exact path='/Myorders' element={token ? <Myorders /> : <Home />} />
            <Route exact path='/Checkout' element={token ? <Checkout /> : <Home />} />
            <Route exact path='/admin' element={<AdminHome />} />
            <Route exact path='/contact' element={<Contactus />} />
            <Route exact path='/profile' element={<Profile />} />

            <Route path="/admin" element={<AdminHome />}>
              <Route index element={<DashboardWrapper />} />
              <Route path="dashboard" element={<DashboardWrapper />} />
              <Route path="products" element={<ShowdataWrapper />} />
              <Route path="orders" element={<ShowOrdersWrapper />} />
            </Route>
          </Routes>
        </div>
      </Router>

    </>
  )
}

export default App
