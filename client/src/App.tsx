import { useState, useRef } from 'react';
import { PartsList } from './components/PartsListComponent';
import { CreatePartModal } from './components/CreatePartModal';

function App() {
  const [showModal, setShowModal] = useState(false);
    const refreshRef = useRef<(() => void) | null>(null);

    const handlePartCreated = () => {
        if (refreshRef.current) {
            refreshRef.current();
        }
    };

  return (
    <>
      <header className="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="dark">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" href="/">Parts Tracker</a>
      </header>
      <div className="container-fluid">
        <div className="row">
          <div className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
            <div className="offcanvas-md offcanvas-end bg-body-tertiary" tabIndex={-1} id="sidebarMenu"
              aria-labelledby="sidebarMenuLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="sidebarMenuLabel">Parts Tracker</h5> <button type="button"
                  className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu"
                  aria-label="Close"></button>
              </div>
              <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a href="/" className="nav-link d-flex align-items-center gap-2 active" aria-current="page">
                      Parts
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">Parts</h1>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group me-2">
                  <button type="button" className="btn btn-sm btn-primary" onClick={() => setShowModal(true)}>Add Part</button>
                </div>
              </div>
            </div>
            <PartsList refreshRef={refreshRef} />
          </main>
        </div>
      </div>

      <CreatePartModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handlePartCreated}
      />
    </>
  );
}

export default App;
