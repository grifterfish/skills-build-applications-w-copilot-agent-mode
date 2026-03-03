import { useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('/users');
  const navigate = useNavigate();
  const apiRootUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/`
    : 'http://localhost:8000/api/';

  const handleNavigate = (event) => {
    event.preventDefault();
    navigate(selectedRoute);
  };

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg octofit-nav mb-4">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center" to="/users">
            <img
              src={`${process.env.PUBLIC_URL}/octofitapp-small.png`}
              alt="OctoFit"
              className="brand-logo me-2"
            />
            <span className="brand-text">OctoFit Tracker</span>
          </NavLink>
          <div className="navbar-nav ms-auto">
            <NavLink className="nav-link" to="/users">Users</NavLink>
            <NavLink className="nav-link" to="/teams">Teams</NavLink>
            <NavLink className="nav-link" to="/activities">Activities</NavLink>
            <NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink>
            <NavLink className="nav-link" to="/workouts">Workouts</NavLink>
          </div>
        </div>
      </nav>

      <main className="container pb-4">
        <section className="mb-4">
          <div className="card octofit-card">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h1 className="h3 page-title mb-0">OctoFit Dashboard</h1>
                <a className="link-primary fw-semibold" href={apiRootUrl} target="_blank" rel="noreferrer">
                  Open REST API Root
                </a>
              </div>
              <p className="page-subtitle mb-3">
                Navigate between Users, Teams, Activities, Leaderboard, and Workouts from one consistent view.
              </p>
              <form className="row g-2 align-items-end" onSubmit={handleNavigate}>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="routeSelect">Go to section</label>
                  <select
                    id="routeSelect"
                    className="form-select"
                    value={selectedRoute}
                    onChange={(event) => setSelectedRoute(event.target.value)}
                  >
                    <option value="/users">Users</option>
                    <option value="/teams">Teams</option>
                    <option value="/activities">Activities</option>
                    <option value="/leaderboard">Leaderboard</option>
                    <option value="/workouts">Workouts</option>
                  </select>
                </div>
                <div className="col-md-auto">
                  <button type="submit" className="btn btn-primary">Go</button>
                </div>
                <div className="col-md-auto">
                  <button type="button" className="btn btn-success" onClick={() => setShowModal(true)}>
                    App Info
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>

      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" aria-hidden={!showModal}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content octofit-modal">
            <div className="modal-header">
              <h5 className="modal-title">OctoFit Frontend</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">All sections use consistent Bootstrap cards, forms, tables, links, and API-driven data rendering.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
      {showModal ? <div className="modal-backdrop fade show"></div> : null}
    </div>
  );
}

export default App;
