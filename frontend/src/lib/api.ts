const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  credits: number;
  created_at: string;
}

export interface Crew {
  id: number;
  name: string;
  description: string;
  crew_identifier: string;
  credits_required: number;
  is_single_agent: boolean;
  created_at: string;
}

export interface CrewRun {
  id: string;
  user_id: string;
  crew_id: number;
  inputs: Record<string, any>;
  output?: string;
  status: string;
  created_at: string;
  completed_at?: string;
  crew: Crew;
}

export interface CrewRunStatus {
  id: string;
  status: string;
  output?: string;
  created_at: string;
  completed_at?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async signup(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  async getCrews(): Promise<Crew[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/crews/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get crews');
    }

    return response.json();
  }

  async runCrew(crewId: number, inputs: Record<string, any>): Promise<CrewRun> {
    const response = await fetch(`${API_BASE_URL}/api/v1/crews/${crewId}/run`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ inputs }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to run crew');
    }

    return response.json();
  }

  async getRunStatus(runId: string): Promise<CrewRunStatus> {
    const response = await fetch(`${API_BASE_URL}/api/v1/crews/runs/${runId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get run status');
    }

    return response.json();
  }

  createWebSocket(runId: string): WebSocket {
    const token = localStorage.getItem('token');
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/ws/runs/${runId}`;
    return new WebSocket(wsUrl);
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

export const apiService = new ApiService();