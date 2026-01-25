import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Footer from './pages/Footer';
import Home from './pages/Home';
import CarDetails from "./components/CarDetails";

function App() {
  return (
    <>
        <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/car/:id" element={<CarDetails />} />
          </Routes>
          <Footer />
        </div>
    </>
  )
}

export default App
