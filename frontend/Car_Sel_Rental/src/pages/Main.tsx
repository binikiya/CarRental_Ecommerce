import Header from "../components/Header";
import Home from "../pages/Home";

function App() {
    return (
        <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Header />
            <Home />
        </div>
    );
}

export default App;