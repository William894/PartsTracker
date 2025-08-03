import React, { useState } from 'react';
import type { ApiError } from '../interfaces/ApiError';
import { partsApi } from '../services/partsApi';

interface CreatePartModalProps {
  show: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreatePartModal({ show, onClose, onCreated }: CreatePartModalProps) {
  const [partNumber, setPartNumber] = useState('');
  const [description, setDescription] = useState('');
  const [quantityOnHand, setQuantityOnHand] = useState(0);
  const [locationCode, setLocationCode] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await partsApi.createPart({
        partNumber,
        description,
        quantityOnHand,
        locationCode,
        lastStockCheckDate: null
      });
      setPartNumber('');
      setDescription('');
      setQuantityOnHand(0);
      setLocationCode('');
      if (onCreated) onCreated();
      onClose();
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show" style={{ display: 'block' }} tabIndex={-1} id="addPartModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Create Part</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  {(!error.errors || error.errors.length === 0) ? (
                    error.title && <div><strong>{error.title}</strong></div>
                  ) : (
                    <>
                      {error.errors && error.errors.length > 0 && (
                        <ul className="mb-0">
                          {error.errors.map((err, idx) => (
                            <li key={idx}>{err.message}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Part Number</label>
                <input className={`form-control ${error?.errors?.some(err => err.field === "partNumber") ? " is-invalid" : ""}`} value={partNumber} onChange={e => setPartNumber(e.target.value)} required />
                {error?.errors &&
                  error.errors
                    .filter(err => err.field === "partNumber")
                    .map((err, idx) => (
                      <div key={idx} className="invalid-feedback">{err.message}</div>
                    ))
                }
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input className={`form-control ${error?.errors?.some(err => err.field === "description") ? " is-invalid" : ""}`} value={description} onChange={e => setDescription(e.target.value)} required />
                {error?.errors &&
                  error.errors
                    .filter(err => err.field === "description")
                    .map((err, idx) => (
                      <div key={idx} className="invalid-feedback">{err.message}</div>
                    ))
                }
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity On Hand</label>
                <input type="number" className={`form-control ${error?.errors?.some(err => err.field === "quantityOnHand") ? " is-invalid" : ""}`} value={quantityOnHand} onChange={e => setQuantityOnHand(Number(e.target.value))} required />
                {error?.errors &&
                  error.errors
                    .filter(err => err.field === "quantityOnHand")
                    .map((err, idx) => (
                      <div key={idx} className="invalid-feedback">{err.message}</div>
                    ))
                }
              </div>
              <div className="mb-3">
                <label className="form-label">Location Code</label>
                <input className={`form-control ${error?.errors?.some(err => err.field === "locationCode") ? " is-invalid" : ""}`} value={locationCode} onChange={e => setLocationCode(e.target.value)} required />
                {error?.errors &&
                  error.errors
                    .filter(err => err.field === "locationCode")
                    .map((err, idx) => (
                      <div key={idx} className="invalid-feedback">{err.message}</div>
                    ))
                }
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