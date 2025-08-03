import React, { useEffect, useState } from 'react';
import { useApiResult } from '../services/useApiResult';
import type { Part } from '../interfaces/Part';
import { EditPartModal } from './EditPartModal';
import { DeletePartModal } from './DeletePartModal';
import { partsApi } from '../services/partsApi';

export function GetPartsList({ refreshRef }: { refreshRef?: React.MutableRefObject<(() => void) | null> }) {
    const { data: parts, loading, error, execute } = useApiResult<Part[]>(partsApi.getParts);
    const [editPart, setEditPart] = useState<Part | null>(null);
    const [deletePart, setDeletePart] = useState<Part | null>(null);

    useEffect(() => {
        execute();
        
        if (refreshRef) {
            refreshRef.current = execute;
        }
    }, [execute, refreshRef]);

    const handleSaved = () => execute();
    const handleDeleted = () => execute();

    if (loading) return (
        <>
            <tr>
                <th className="text-center" colSpan={6}>Loading...</th>
            </tr>
        </>
    );
    if (error) return (
        <>
            <tr>
                <th className="text-center" colSpan={6}>Error: {error.name || error.message}</th>
            </tr>
        </>
    );
    if (!parts || parts.length === 0) return (
        <>
            <tr>
                <th className="text-center" colSpan={6}>No Parts Available</th>
            </tr>
        </>
    );

    return (
        <>
            {parts.map(part => (
                <tr key={part.partNumber}>
                    <td>{part.partNumber}</td>
                    <td>{part.description}</td>
                    <td>{part.quantityOnHand}</td>
                    <td>{part.locationCode}</td>
                    <td>{formatDate(part.lastStockCheckDate)}</td>
                    <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditPart(part)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setDeletePart(part)}>Delete</button>
                    </td>
                </tr>
            ))}
            <EditPartModal
                part={editPart}
                show={!!editPart}
                onClose={() => setEditPart(null)}
                onSaved={handleSaved}
            />
            <DeletePartModal
                part={deletePart}
                show={!!deletePart}
                onClose={() => setDeletePart(null)}
                onDeleted={handleDeleted}
            />
        </>
    );
}

export function PartsList({ refreshRef }: { refreshRef?: React.MutableRefObject<(() => void) | null> }) {
    return (
        <div className="parts-list-component">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Part Number</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Location</th>
                        <th>Last Stock Take</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <GetPartsList refreshRef={refreshRef} />
                </tbody>
            </table>
        </div>
    );
}

function formatDate(date: Date | null): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
}