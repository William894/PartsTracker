import React, { useState, useEffect } from 'react';
import type { Part } from '../interfaces/Part';
import type { ApiError } from '../interfaces/ApiError';
import { partsApi } from '../services/partsApi';

interface DeletePartModalProps {
  part: Part | null;
  show: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeletePartModal({ part, show, onClose, onDeleted }: DeletePartModalProps) {
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) setError(null);
  }, [show, part]);

  if (!show || !part) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await partsApi.deletePart(part.partNumber);
      onDeleted();
      onClose();
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Part</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger">
                {error.detail || error.title || 'Failed to delete part'}
                {error.errors && error.errors.length > 0 && (
                  <ul className="mb-0">
                    {error.errors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <p>Are you sure you want to delete part <strong>{part.partNumber}</strong>?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}