import { useCallback, useEffect, useState } from 'react';

const normalizeResponse = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
};

function Activities() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError('');
    console.log('Activities endpoint:', endpoint);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log('Activities fetched data:', data);
      const normalized = normalizeResponse(data);
      setActivities(normalized);
      setFilteredActivities(normalized);
    } catch (fetchError) {
      console.error('Activities fetch error:', fetchError);
      setError('Failed to load activities data.');
      setActivities([]);
      setFilteredActivities([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = query.trim().toLowerCase();
    if (!value) {
      setFilteredActivities(activities);
      return;
    }
    const next = activities.filter((activity) => JSON.stringify(activity).toLowerCase().includes(value));
    setFilteredActivities(next);
  };

  const clearSearch = () => {
    setQuery('');
    setFilteredActivities(activities);
  };

  return (
    <section>
      <div className="card octofit-card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h4 section-title mb-0">Activities</h2>
            <a className="link-primary fw-semibold" href={endpoint} target="_blank" rel="noreferrer">
              Open Activities API
            </a>
          </div>

          <form className="row g-2 align-items-end mb-3" onSubmit={handleSearch}>
            <div className="col-md-6">
              <label className="form-label fw-semibold" htmlFor="activitiesQuery">Search activities</label>
              <input
                id="activitiesQuery"
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
              <button type="button" className="btn btn-success" onClick={fetchActivities}>Refresh</button>
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
                  <tr><td colSpan="4">Loading activities...</td></tr>
                ) : error ? (
                  <tr><td colSpan="4" className="text-danger">{error}</td></tr>
                ) : filteredActivities.length === 0 ? (
                  <tr><td colSpan="4">No activities found.</td></tr>
                ) : (
                  filteredActivities.map((activity, index) => (
                    <tr key={activity.id || activity._id || index}>
                      <td>{index + 1}</td>
                      <td>{activity.id || activity._id || '-'}</td>
                      <td>{activity.name || activity.activity_type || 'Activity'}</td>
                      <td><small>{JSON.stringify(activity)}</small></td>
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
              <h5 className="modal-title">Activities Raw Data</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body"><pre className="mb-0 small">{JSON.stringify(activities, null, 2)}</pre></div>
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

export default Activities;
