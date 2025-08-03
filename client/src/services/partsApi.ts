import { ApiError } from "../interfaces/ApiError";
import { Part } from "../interfaces/Part";
import axios from "axios";


const baseUrl = process.env.REACT_APP_API_URL || 'https://localhost:5001/api';

const getParts: () => Promise<Part[]> = async () => {
  try {
    const response = await axios.get<Part[]>(`${baseUrl}/parts`);
    return response.data;
  } catch (err: any) {
    throw mapApiError(err);
  }
};

const updatePart: (part: Part) => Promise<Part> = async (part) => {
  try {
    const response = await axios.patch<Part>(`${baseUrl}/parts/${encodeURIComponent(part.partNumber)}`, part);
    return response.data;
  } catch (err: any) {
    throw mapApiError(err);
  }
};

const deletePart: (partNumber: string) => Promise<void> = async (partNumber) => {
  try {
    await axios.delete(`${baseUrl}/parts/${encodeURIComponent(partNumber)}`);
  } catch (err: any) {
    throw mapApiError(err);
  }
};

const createPart: (part: Part) => Promise<Part> = async (part) => {
  try {
    const response = await axios.post<Part>(`${baseUrl}/parts`, part);
    return response.data;
  } catch (err: any) {
    throw mapApiError(err);
  }
};

function mapApiError(err: any): ApiError {
  if (err.response && err.response.data) {
    return {
      type: err.response.data.type || 'exception',
      title: err.response.data.title || 'Error',
      status: err.response.status,
      detail: err.response.data.detail || err.response.data.message || 'Unknown error',
      errors: err.response.data.errors || []
    };
  }
  return {
    type: 'exception',
    title: 'Unexpected error',
    status: 0,
    detail: err.message || 'Unknown error',
    errors: []
  };
}

export const partsApi = {
  getParts,
  updatePart,
  deletePart,
  createPart
};