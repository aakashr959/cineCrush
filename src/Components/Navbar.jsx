import { Link } from "react-router-dom";
import "../css/Navbar.css";
function Navbar() {
    return (
        <nav className = "navbar">
            <div className="navbar-brand">
                <Link to = "/" className ="website-title-split">
  <span className="word-one">cine</span><span className="word-two">Crush</span>
 </Link>
            </div>
            <div className="navbar-links">
                <Link to = "/" className = "nav-links"> Home </Link>
                <Link to = "/favourites" className = "nav-links"> Favourites </Link>
                {/*<Link to = "/watchList" className = "nav-links"> Watch List </Link> */}
            </div>
        </nav>
    );
}

export default Navbar;