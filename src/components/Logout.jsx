import "../components/Logout.css"

export function Logout({ handleLogoutClose, handleLogoutSubmit }) {
    return (
        <div className="modalOverlay">
            <div className="modal">
                <div className="alert">
                    <div className="alert-msg">
                        Are you sure you want to logout?
                    </div>
                    <div className="btn-grp">
                        <button type="button" className="btn-blue" onClick={handleLogoutClose}>
                            Cancle
                        </button>
                        <button type="button" className="btn-red" onClick={handleLogoutSubmit}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}