import './css/App.css';
import MovieCard from './Components/MovieCard';
import Home from './pages/Home';
import Favourites from './pages/Favourites';
{/*import WatchList from './pages/WatchList'; */}
import {Routes, Route} from 'react-router-dom';
import Navbar from './Components/Navbar';
import { MovieProvider } from './contexts/MovieContext';
import Footer from './Components/Footer';



function App() {
  return (
    <MovieProvider>
      <div>
      <Navbar />
      
      <main className = "main-content">
      <Routes>
        <Route path = "/" element={<Home />} />
        <Route path = "/favourites" element={<Favourites />} />
        {/*<Route path = "/watchList" element={<WatchList />} /> */}
        
        
        <Route path = "*" element={<h1> 404 Not Found </h1>} />
      </Routes>
    </main>
    <Footer />

    </div>
    </MovieProvider>
     
    
  );
}

export default App;
