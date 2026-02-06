import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Footer from './pages/Footer';
import Home from './pages/Home';
import CarDetails from "./components/CarDetails";
import Login from "./pages/Login";
import SellerDashboard from "./pages/SellerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddCar from "./pages/AddCar";
import UploadImages from "./pages/UploadImages";
import EditCar from "./pages/EditCar";

function App() {
  return (
    <>
        <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/add-car" element={<AddCar />} />
              <Route path="/seller/upload-images/:carId" element={<UploadImages />} />
              <Route path="/seller/edit-car/:id" element={<EditCar />} />
            </Route>
          </Routes>
          <Footer />
        </div>
    </>
  )
}

export default App
