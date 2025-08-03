import React, { useState, useEffect } from 'react';
import type { Part } from '../interfaces/Part';
import type { ApiError } from '../interfaces/ApiError';
import { partsApi } from '../services/partsApi';

interface EditPartModalProps {
  part: Part | null;
  show: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function EditPartModal({ part, show, onClose, onSaved }: EditPartModalProps) {
  const [description, setDescription] = useState('');
  const [quantityOnHand, setQuantityOnHand] = useState(0);
  const [locationCode, setLocationCode] = useState('');
  const [lastStockTake, setLastStockTake] = useState<string>('');
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (part) {
      setDescription(part.description);
      setQuantityOnHand(part.quantityOnHand);
      setLocationCode(part.locationCode);
      setLastStockTake(
        part.lastStockCheckDate
          ? new Date(part.lastStockCheckDate).toISOString().slice(0, 10)
          : ''
      );
    }
  }, [part]);

  if (!show || !part) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await partsApi.updatePart({
        partNumber: part.partNumber,
        description,
        quantityOnHand,
        locationCode,
        lastStockCheckDate: lastStockTake ? new Date(lastStockTake) : null
      });
      onSaved();
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
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Part</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  {error.detail && <div><strong>{error.detail}</strong></div>}
                  {error.errors && error.errors.length > 0 && (
                    <ul className="mb-0">
                      {error.errors.map((err, idx) => (
                        <li key={idx}>{err.message}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Part Number</label>
                <input className="form-control" value={part.partNumber} readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity On Hand</label>
                <input type="number" className="form-control" value={quantityOnHand} onChange={e => setQuantityOnHand(Number(e.target.value))} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Location Code</label>
                <input className="form-control" value={locationCode} onChange={e => setLocationCode(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Last Stock Take</label>
                <input
                  type="date"
                  className="form-control"
                  value={lastStockTake}
                  onChange={e => setLastStockTake(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}