import { useCallback, useEffect, useState } from 'react';

const getBaseApiUrl = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api`;
  }
  return 'http://localhost:8000/api';
};

const normalizeResponse = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
};

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const endpoint = `${getBaseApiUrl()}/workouts/`;

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError('');
    console.log('Workouts endpoint:', endpoint);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log('Workouts fetched data:', data);
      const normalized = normalizeResponse(data);
      setWorkouts(normalized);
      setFilteredWorkouts(normalized);
    } catch (fetchError) {
      console.error('Workouts fetch error:', fetchError);
      setError('Failed to load workouts data.');
      setWorkouts([]);
      setFilteredWorkouts([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = query.trim().toLowerCase();
    if (!value) {
      setFilteredWorkouts(workouts);
      return;
    }
    const next = workouts.filter((workout) => JSON.stringify(workout).toLowerCase().includes(value));
    setFilteredWorkouts(next);
  };

  const clearSearch = () => {
    setQuery('');
    setFilteredWorkouts(workouts);
  };

  return (
    <section>
      <div className="card octofit-card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h4 section-title mb-0">Workouts</h2>
            <a className="link-primary fw-semibold" href={endpoint} target="_blank" rel="noreferrer">
              Open Workouts API
            </a>
          </div>

          <form className="row g-2 align-items-end mb-3" onSubmit={handleSearch}>
            <div className="col-md-6">
              <label className="form-label fw-semibold" htmlFor="workoutsQuery">Search workouts</label>
              <input
                id="workoutsQuery"
                className="form-control"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type to filter table rows"
              />
            </div>
            <div className="col-md-auto">
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
            <div className="col-md-auto">
              <button type="button" className="btn btn-outline-secondary" onClick={clearSearch}>Clear</button>
            </div>
            <div className="col-md-auto">
              <button type="button" className="btn btn-success" onClick={fetchWorkouts}>Refresh</button>
            </div>
            <div className="col-md-auto">
              <button type="button" className="btn btn-info text-white" onClick={() => setShowModal(true)}>Raw Data</button>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle octofit-table mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ID</th>
                  <th scope="col">Primary</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4">Loading workouts...</td></tr>
                ) : error ? (
                  <tr><td colSpan="4" className="text-danger">{error}</td></tr>
                ) : filteredWorkouts.length === 0 ? (
                  <tr><td colSpan="4">No workouts found.</td></tr>
                ) : (
                  filteredWorkouts.map((workout, index) => (
                    <tr key={workout.id || workout._id || index}>
                      <td>{index + 1}</td>
                      <td>{workout.id || workout._id || '-'}</td>
                      <td>{workout.name || workout.title || 'Workout'}</td>
                      <td><small>{JSON.stringify(workout)}</small></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" aria-hidden={!showModal}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content octofit-modal">
            <div className="modal-header">
              <h5 className="modal-title">Workouts Raw Data</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body"><pre className="mb-0 small">{JSON.stringify(workouts, null, 2)}</pre></div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
      {showModal ? <div className="modal-backdrop fade show"></div> : null}
    </section>
  );
}

export default Workouts;
