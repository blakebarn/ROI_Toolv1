import type { Project, ROIResult, FormOptions, KnowledgeBaseInsight, ServiceProfile } from '../types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// Projects API
export const projectsApi = {
  getAll: () => fetchJSON<Project[]>(`${API_BASE}/projects`),

  getById: (id: string) => fetchJSON<Project>(`${API_BASE}/projects/${id}`),

  create: (project: Partial<Project>) =>
    fetchJSON<Project>(`${API_BASE}/projects`, {
      method: 'POST',
      body: JSON.stringify(project),
    }),

  update: (id: string, project: Partial<Project>) =>
    fetchJSON<Project>(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    }),

  delete: (id: string) =>
    fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' }),

  saveDraft: (draft: Partial<Project>) =>
    fetchJSON<Project>(`${API_BASE}/projects/drafts`, {
      method: 'POST',
      body: JSON.stringify(draft),
    }),

  getDraft: (id: string) =>
    fetchJSON<Project>(`${API_BASE}/projects/drafts/${id}`),
};

// Calculations API
export const calculationsApi = {
  calculateROI: (project: Partial<Project>, forecastMode = 'base') =>
    fetchJSON<ROIResult>(`${API_BASE}/calculations/roi`, {
      method: 'POST',
      body: JSON.stringify({ project, forecastMode }),
    }),

  calculateScenarios: (project: Partial<Project>) =>
    fetchJSON<{
      conservative: ROIResult;
      base: ROIResult;
      optimistic: ROIResult;
    }>(`${API_BASE}/calculations/roi/scenarios`, {
      method: 'POST',
      body: JSON.stringify({ project }),
    }),

  quickEstimate: (data: {
    primaryServiceOffering: string;
    totalInvestment: number;
    industryVertical?: string;
    companySize?: string;
  }) =>
    fetchJSON<{ estimatedRoi: number; typicalRoiRange: { min: number; max: number } }>(
      `${API_BASE}/calculations/quick-estimate`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),
};

// Knowledge Base API
export const knowledgeBaseApi = {
  getFormOptions: () =>
    fetchJSON<FormOptions>(`${API_BASE}/knowledge-base/form-options`),

  getServiceOfferings: () =>
    fetchJSON<ServiceProfile[]>(`${API_BASE}/knowledge-base/service-offerings`),

  getServiceProfile: (id: string) =>
    fetchJSON<ServiceProfile>(`${API_BASE}/knowledge-base/service-offerings/${id}`),

  getInsights: (data: {
    primaryServiceOffering: string;
    industryVertical?: string;
    companySize?: string;
    organizationalMaturity?: string;
    secondaryServiceOfferings?: string[];
  }) =>
    fetchJSON<{ insights: KnowledgeBaseInsight[] }>(
      `${API_BASE}/knowledge-base/insights`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),
};

// Exports API
export const exportsApi = {
  downloadCSV: async (project: Partial<Project>) => {
    const response = await fetch(`${API_BASE}/exports/csv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project }),
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roi-forecast-${project.projectName || 'project'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  downloadPDF: async (project: Partial<Project>) => {
    const response = await fetch(`${API_BASE}/exports/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project }),
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roi-forecast-${project.projectName || 'project'}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  getExecutiveSummary: (project: Partial<Project>) =>
    fetchJSON<{
      projectName: string;
      totalInvestment: number;
      yearOneValue: number;
      roi: number;
      paybackPeriodMonths: number;
      keyInsights: string[];
    }>(`${API_BASE}/exports/executive-summary`, {
      method: 'POST',
      body: JSON.stringify({ project }),
    }),
};
