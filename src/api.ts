import {
  Profile, Project, Skill, Experience,
  ContactMessage, ContactPayload, PaginatedResponse
} from './types';

const BASE = 'http://127.0.0.1:8000/api';

const token    = (): string | null  => localStorage.getItem('token');
const headers  = (): HeadersInit    => ({
  'Content-Type': 'application/json',
  ...(token() && { Authorization: `Token ${token()}` }),
});

// ── auth ────────────────────────────────────────────────────────────────────

export const login = async (username: string, password: string): Promise<string> => {
  const res  = await fetch(`${BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Invalid credentials');
  return data.token as string;
};

// ── public ──────────────────────────────────────────────────────────────────

export const getProfile = async (): Promise<Profile> => {
  const res = await fetch(`${BASE}/profile/`);
  if (!res.ok) throw new Error('Profile not found');
  return res.json();
};
export const getProject = async (id: number): Promise<Project> => {
  const res = await fetch(`${BASE}/projects/${id}/`);
  if (!res.ok) throw new Error('Project not found');
  return res.json() as Promise<Project>;
};

export const getProjects = async (params: Record<string,string> = {}): Promise<PaginatedResponse<Project>> => {
  const qs  = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/projects/${qs ? '?' + qs : ''}`);
  if (!res.ok) throw new Error('Could not load projects');
  const data = await res.json();
  // handle both paginated and plain array responses
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data };
  }
  return data;
};

export const getSkills = async (): Promise<PaginatedResponse<Skill>> => {
  const res = await fetch(`${BASE}/skills/`);
  if (!res.ok) throw new Error('Could not load skills');
  const data = await res.json();
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data };
  }
  return data;
};

export const getExperience = async (): Promise<PaginatedResponse<Experience>> => {
  const res = await fetch(`${BASE}/experience/`);
  if (!res.ok) throw new Error('Could not load experience');
  const data = await res.json();
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data };
  }
  return data;
};

export const sendContact = async (payload: ContactPayload): Promise<void> => {
  const res = await fetch(`${BASE}/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Could not send message');
};

// ── admin ───────────────────────────────────────────────────────────────────

export const adminGetProfile  = async (): Promise<Profile> => {
  const res = await fetch(`${BASE}/admin/profile/`, { headers: headers() });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
};

export const adminUpdateProfile = async (data: Partial<Profile>): Promise<Profile> => {
  const res = await fetch(`${BASE}/admin/profile/`, {
    method: 'PATCH', headers: headers(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
};

export const adminGetProjects = async (): Promise<PaginatedResponse<Project>> => {
  const res = await fetch(`${BASE}/admin/projects/`, { headers: headers() });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
};

export const adminCreateProject = async (data: Partial<Project>): Promise<Project> => {
  const res = await fetch(`${BASE}/admin/projects/`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
};

export const adminUpdateProject = async (id: number, data: Partial<Project>): Promise<Project> => {
  const res = await fetch(`${BASE}/admin/projects/${id}/`, {
    method: 'PATCH', headers: headers(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
};

export const adminDeleteProject = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE}/admin/projects/${id}/`, {
    method: 'DELETE', headers: headers(),
  });
  if (!res.ok) throw new Error('Could not delete project');
};

export const adminGetSkills = async (): Promise<PaginatedResponse<Skill>> => {
  const res = await fetch(`${BASE}/admin/skills/`, { headers: headers() });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
};

export const adminCreateSkill = async (data: Partial<Skill>): Promise<Skill> => {
  const res = await fetch(`${BASE}/admin/skills/`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
};

export const adminUpdateSkill = async (id: number, data: Partial<Skill>): Promise<Skill> => {
  const res = await fetch(`${BASE}/admin/skills/${id}/`, {
    method: 'PATCH', headers: headers(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
};

export const adminDeleteSkill = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE}/admin/skills/${id}/`, {
    method: 'DELETE', headers: headers(),
  });
  if (!res.ok) throw new Error('Could not delete skill');
};

export const adminGetExperience = async (): Promise<PaginatedResponse<Experience>> => {
  const res = await fetch(`${BASE}/admin/experience/`, { headers: headers() });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
};

export const adminCreateExperience = async (data: Partial<Experience>): Promise<Experience> => {
  const res = await fetch(`${BASE}/admin/experience/`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
};

export const adminUpdateExperience = async (id: number, data: Partial<Experience>): Promise<Experience> => {
  const res = await fetch(`${BASE}/admin/experience/${id}/`, {
    method: 'PATCH', headers: headers(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
};

export const adminDeleteExperience = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE}/admin/experience/${id}/`, {
    method: 'DELETE', headers: headers(),
  });
  if (!res.ok) throw new Error('Could not delete experience');
};

export const adminGetMessages = async (): Promise<PaginatedResponse<ContactMessage>> => {
  const res = await fetch(`${BASE}/admin/messages/`, { headers: headers() });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
};

export const adminMarkRead = async (id: number): Promise<ContactMessage> => {
  const res = await fetch(`${BASE}/admin/messages/${id}/`, {
    method: 'PATCH', headers: headers(), body: JSON.stringify({ is_read: true }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
};

export const adminDeleteMessage = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE}/admin/messages/${id}/`, {
    method: 'DELETE', headers: headers(),
  });
  if (!res.ok) throw new Error('Could not delete message');
};

export const saveSession  = (t: string): void => localStorage.setItem('token', t);
export const clearSession = ():  void => localStorage.removeItem('token');
export const isLoggedIn   = (): boolean => !!localStorage.getItem('token');