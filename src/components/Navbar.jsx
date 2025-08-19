import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useState } from 'react';
import { Logout } from './Logout';
import { toast } from 'react-toastify';
import AvatarHover from './AvatarHover';

export function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();
    const [openLogout, setOpenLogout] = useState(false);

    const userimg = JSON.parse(localStorage.getItem("loginData"))?.userImage;

    const handleLogoutClose = () => {
        setOpenLogout(false);
    }
    const handleLogoutSubmit = () => {
        localStorage.removeItem("loginData");
        navigate("/login");
        toast.success("Logout successfully!");
        setOpenLogout(false);
    }

    return (
        <>
            <div className='navbar'>
                <div className='logo'>Expense Tracker</div>
                <ul>
                    <li>
                        <Link to="/" className={location === "/" ? 'link-active' : 'link'}>Home</Link>
                    </li>
                </ul>
                <div className='logout'>
                    <AvatarHover className="user-icon" alt="user" avatarUrl={userimg} />
                    <button onClick={() => setOpenLogout(true)} type='button' className='btn-red'>Logout</button>
                </div>
            </div>

            {openLogout && <Logout handleLogoutClose={handleLogoutClose} handleLogoutSubmit={handleLogoutSubmit} />}
        </>
    )
}