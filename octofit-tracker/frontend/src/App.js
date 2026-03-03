import { useState } from 'react';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(false);

  const activityRows = [
    { id: 1, activity: 'Morning Run', duration: '35 min', calories: 320 },
    { id: 2, activity: 'Cycling', duration: '50 min', calories: 410 },
    { id: 3, activity: 'Strength Session', duration: '45 min', calories: 365 },
  ];

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg octofit-nav mb-4">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#overview">
            <img
              src={`${process.env.PUBLIC_URL}/octofitapp-small.png`}
              alt="OctoFit"
              className="brand-logo me-2"
            />
            <span className="brand-text">OctoFit Tracker</span>
          </a>
          <div className="navbar-nav ms-auto">
            <a className="nav-link active" href="#overview">
              Dashboard
            </a>
            <a className="nav-link" href="#log">
              Activity Log
            </a>
            <a className="nav-link" href="#leaderboard">
              Leaderboard
            </a>
          </div>
        </div>
      </nav>

      <main className="container pb-4">
        <section id="overview" className="mb-4">
          <h1 className="display-6 fw-bold page-title">Your OctoFit Overview</h1>
          <p className="lead page-subtitle mb-0">
            Track workouts, monitor progress, and challenge your team.
          </p>
          <a href="#log" className="overview-link">
            Go to activity log
          </a>
        </section>

        <section className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card h-100 octofit-card">
              <div className="card-body">
                <h2 className="h4 card-title">Weekly Goal</h2>
                <p className="card-text mb-3">Complete 5 workouts this week.</p>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  View Goal Details
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6" id="log">
            <div className="card h-100 octofit-card">
              <div className="card-body">
                <h2 className="h4 card-title">Log New Activity</h2>
                <form className="row g-2">
                  <div className="col-12">
                    <label className="form-label" htmlFor="activityName">
                      Activity
                    </label>
                    <input
                      id="activityName"
                      type="text"
                      className="form-control"
                      placeholder="e.g. HIIT"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label" htmlFor="duration">
                      Duration
                    </label>
                    <input id="duration" type="text" className="form-control" placeholder="40 min" />
                  </div>
                  <div className="col-6">
                    <label className="form-label" htmlFor="calories">
                      Calories
                    </label>
                    <input id="calories" type="number" className="form-control" placeholder="350" />
                  </div>
                  <div className="col-12">
                    <button type="button" className="btn btn-success w-100">
                      Save Activity
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section id="leaderboard" className="mb-3">
          <h2 className="h3 section-title">Activity Leaderboard</h2>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle octofit-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Activity</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Calories</th>
                </tr>
              </thead>
              <tbody>
                {activityRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.activity}</td>
                    <td>{row.duration}</td>
                    <td>{row.calories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" aria-hidden={!showModal}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content octofit-modal">
            <div className="modal-header">
              <h5 className="modal-title">Weekly Goal Details</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">You are 3 of 5 workouts complete. Keep up the momentum.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal ? <div className="modal-backdrop fade show"></div> : null}
    </div>
  );
}

export default App;
