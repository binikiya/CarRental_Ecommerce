import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Footer from './pages/Footer';
import Home from './pages/Home';
import CarDetails from "./components/CarDetails";
import Login from "./pages/Login";
import SellerLayout from "./layouts/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddCar from "./pages/seller/AddCar";
import UploadImages from "./pages/seller/UploadImages";
import EditCar from "./pages/seller/EditCar";
import SellerEarnings from "./pages/seller/SellerEarnings";
import ManageOrders from "./pages/seller/ManageOrders";
import ShopSettings from "./pages/seller/ShopSettings";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageSellers from "./pages/admin/ManageSellers";
import ManageDisputes from "./pages/admin/ManageDisputes";
import ManagePermissions from "./pages/admin/ManagePermissions";
import CommissionSettings from "./pages/admin/CommissionSettings";
import AuditLogs from "./pages/admin/AuditLogs";
import ManageProducts from "./pages/admin/ManageProducts";

import CustomerLayout from "./layouts/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Profile from "./pages/customer/Profile";
import MyOrders from "./pages/customer/MyOrders";
import WishlistPage from "./pages/customer/Wishlist";
import BookingHistory from "./pages/customer/BookingHistory";
import ManageAddresses from "./pages/customer/ManageAddresses";
import ManagePayments from "./pages/customer/ManagePayments";
import ManageReviews from "./pages/customer/ManageReviews";


function App() {
  return (
    <>
        <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/sellers" element={<ManageSellers />} />
                <Route path="/admin/disputes" element={<ManageDisputes />} />
                <Route path="/admin/permissions" element={<ManagePermissions />} />
                <Route path="/admin/commission" element={<CommissionSettings />} />
                <Route path="/admin/logs" element={<AuditLogs />} />
                <Route path="/admin/products" element={<ManageProducts />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
              <Route element={<SellerLayout />}>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/add-car" element={<AddCar />} />
                <Route path="/seller/earnings" element={<SellerEarnings />} />
                <Route path="/seller/orders" element={<ManageOrders />} />
                <Route path="/seller/settings" element={<ShopSettings />} />
                <Route path="/seller/upload-images/:carId" element={<UploadImages />} />
                <Route path="/seller/edit-car/:id" element={<EditCar />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
              <Route element={<CustomerLayout />}>
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/customer/profile" element={<Profile />} />
                <Route path="/customer/orders" element={<MyOrders />} />
                <Route path="/customer/wishlist" element={<WishlistPage />} />
                <Route path="/customer/history" element={<BookingHistory />} />
                <Route path="/customer/addresses" element={<ManageAddresses />} />
                <Route path="/customer/payments" element={<ManagePayments />} />
                <Route path="/customer/reviews" element={<ManageReviews />} />
              </Route>
            </Route>

          </Routes>
          <Footer />
        </div>
    </>
  )

}


export default App;
