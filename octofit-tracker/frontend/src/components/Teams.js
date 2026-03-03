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

function Teams() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const endpoint = `${getBaseApiUrl()}/teams/`;

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError('');
    console.log('Teams endpoint:', endpoint);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log('Teams fetched data:', data);
      const normalized = normalizeResponse(data);
      setTeams(normalized);
      setFilteredTeams(normalized);
    } catch (fetchError) {
      console.error('Teams fetch error:', fetchError);
      setError('Failed to load teams data.');
      setTeams([]);
      setFilteredTeams([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = query.trim().toLowerCase();
    if (!value) {
      setFilteredTeams(teams);
      return;
    }
    const next = teams.filter((team) => JSON.stringify(team).toLowerCase().includes(value));
    setFilteredTeams(next);
  };

  const clearSearch = () => {
    setQuery('');
    setFilteredTeams(teams);
  };

  return (
    <section>
      <div className="card octofit-card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h4 section-title mb-0">Teams</h2>
            <a className="link-primary fw-semibold" href={endpoint} target="_blank" rel="noreferrer">
              Open Teams API
            </a>
          </div>

          <form className="row g-2 align-items-end mb-3" onSubmit={handleSearch}>
            <div className="col-md-6">
              <label className="form-label fw-semibold" htmlFor="teamsQuery">Search teams</label>
              <input
                id="teamsQuery"
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
              <button type="button" className="btn btn-success" onClick={fetchTeams}>Refresh</button>
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
                  <tr><td colSpan="4">Loading teams...</td></tr>
                ) : error ? (
                  <tr><td colSpan="4" className="text-danger">{error}</td></tr>
                ) : filteredTeams.length === 0 ? (
                  <tr><td colSpan="4">No teams found.</td></tr>
                ) : (
                  filteredTeams.map((team, index) => (
                    <tr key={team.id || team._id || index}>
                      <td>{index + 1}</td>
                      <td>{team.id || team._id || '-'}</td>
                      <td>{team.name || team.title || 'Team'}</td>
                      <td><small>{JSON.stringify(team)}</small></td>
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
              <h5 className="modal-title">Teams Raw Data</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body"><pre className="mb-0 small">{JSON.stringify(teams, null, 2)}</pre></div>
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

export default Teams;
