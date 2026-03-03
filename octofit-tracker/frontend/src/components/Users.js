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

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const endpoint = `${getBaseApiUrl()}/users/`;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    console.log('Users endpoint:', endpoint);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log('Users fetched data:', data);
      const normalized = normalizeResponse(data);
      setUsers(normalized);
      setFilteredUsers(normalized);
    } catch (fetchError) {
      console.error('Users fetch error:', fetchError);
      setError('Failed to load users data.');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = query.trim().toLowerCase();
    if (!value) {
      setFilteredUsers(users);
      return;
    }
    const next = users.filter((user) => JSON.stringify(user).toLowerCase().includes(value));
    setFilteredUsers(next);
  };

  const clearSearch = () => {
    setQuery('');
    setFilteredUsers(users);
  };

  return (
    <section>
      <div className="card octofit-card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h4 section-title mb-0">Users</h2>
            <a className="link-primary fw-semibold" href={endpoint} target="_blank" rel="noreferrer">
              Open Users API
            </a>
          </div>

          <form className="row g-2 align-items-end mb-3" onSubmit={handleSearch}>
            <div className="col-md-6">
              <label className="form-label fw-semibold" htmlFor="usersQuery">Search users</label>
              <input
                id="usersQuery"
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
              <button type="button" className="btn btn-success" onClick={fetchUsers}>Refresh</button>
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
                  <tr><td colSpan="4">Loading users...</td></tr>
                ) : error ? (
                  <tr><td colSpan="4" className="text-danger">{error}</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="4">No users found.</td></tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id || user._id || index}>
                      <td>{index + 1}</td>
                      <td>{user.id || user._id || '-'}</td>
                      <td>{user.username || user.name || user.email || 'User'}</td>
                      <td><small>{JSON.stringify(user)}</small></td>
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
              <h5 className="modal-title">Users Raw Data</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body"><pre className="mb-0 small">{JSON.stringify(users, null, 2)}</pre></div>
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

export default Users;
