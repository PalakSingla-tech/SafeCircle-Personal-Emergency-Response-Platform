const DEFAULT_BASE_URL = "http://localhost:8080";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;
const AUTH_TOKEN_STORAGE_KEY = "safecircle_auth_token";

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  verified: boolean;
  avatarInitials: string;
}

export interface FamilyMember {
  id: number;
  memberId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  relationship: string;
  accessStatus: string;
  addedAt: string;
}

export interface EmergencyHistoryEvent {
  id: string;
  date: string;
  time: string;
  location: string;
  responder: string;
  hospital: string;
  type: string;
  status: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: string;
  icon: string;
}

export interface MedicalProfilePayload {
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  height: string;
  weight: string;
  medicalConditions: string;
  currentMedications: string;
  allergies: string;
  pastSurgeries: string;
  disabilities: string;
  organDonor: string;
  emergencyNotes: string;
  insuranceProvider: string;
  policyNumber: string;
  primaryDoctor: string;
  hospitalPreference: string;
}

export interface SettingsProfile {
  notificationsEnabled: boolean;
  locationSharingEnabled: boolean;
  darkMode: boolean;
  emergencyAutoShare: boolean;
}

export interface LocationShareState {
  enabled: boolean;
  sharingWith: string[];
  lastUpdated: string;
  currentLocation: string;
}

export interface QrCardState {
  profileId: string;
  status: string;
  lastUpdated: string;
  shareUrl: string;
}

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface LoginResponsePayload {
  token: string;
  email?: string;
  name?: string;
}

export interface SignupRequestPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface SignupResponsePayload {
  message?: string;
  token?: string;
  email?: string;
  name?: string;
}

export async function getApiHealth() {
  return request<{ status: string; message: string }>('/health');
}

export async function login(payload: LoginRequestPayload) {
  const response = await request<LoginResponsePayload>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (response?.token) {
    setAuthToken(response.token);
  }

  return response;
}

export async function register(payload: SignupRequestPayload) {
  const response = await request<SignupResponsePayload>('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (response?.token) {
    setAuthToken(response.token);
  }

  return response;
}

export async function getEmergencyContacts() {
  return request<EmergencyContact[]>('/dashboard/emergency-contacts');
}

export async function createEmergencyContact(payload: Omit<EmergencyContact, 'id' | 'avatarInitials' | 'verified'>) {
  return request<EmergencyContact>('/dashboard/emergency-contacts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteEmergencyContact(id: string) {
  return request<{ success: boolean }>('/dashboard/emergency-contacts?id=' + encodeURIComponent(id), {
    method: 'DELETE',
  });
}

export async function getFamilyMembers() {
  return request<FamilyMember[]>('/family-members');
}

export async function createFamilyMember(payload: { email: string; relationship: string; accessStatus: string }) {
  return request<FamilyMember>('/family-members', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getEmergencyHistory() {
  return request<EmergencyHistoryEvent[]>('/history');
}

export async function getNotifications() {
  return request<NotificationItem[]>('/notifications');
}

export async function markNotificationsAsRead() {
  return request<NotificationItem[]>('/notifications', {
    method: 'PATCH',
    body: JSON.stringify({ action: 'mark-all-read' }),
  });
}

export async function getMedicalProfile() {
  return request<MedicalProfilePayload>('/dashboard/medical-profile');
}

export async function saveMedicalProfileDraft(payload: MedicalProfilePayload) {
  return request<MedicalProfilePayload>('/dashboard/medical-profile/draft', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function saveMedicalProfile(payload: MedicalProfilePayload) {
  return request<MedicalProfilePayload>('/dashboard/medical-profile', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getSettings() {
  return request<SettingsProfile>('/settings');
}

export async function saveSettings(payload: SettingsProfile) {
  return request<SettingsProfile>('/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updateProfileSettings(payload: { fullName?: string; email?: string; phone?: string }) {
  return request<{ success: boolean }>('/settings/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updatePassword(payload: { currentPassword: string; newPassword: string }) {
  return request<{ success: boolean }>('/settings/password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getLocationSharing() {
  return request<LocationShareState>('/location');
}

export async function getLocationByUserId(userId: string) {
  return request<LocationShareState>(`/location/${encodeURIComponent(userId)}`);
}

export async function saveLocationSharing(payload: LocationShareState) {
  return request<LocationShareState>('/location', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getQrCard() {
  return request<QrCardState>('/qr-card');
}

export async function saveQrCard(payload: QrCardState) {
  return request<QrCardState>('/qr-card', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export interface DashboardResponse {
  userId: number;
  fullName: string;
  email: string;
  completionPercentage: number;
  stats: {
    qrScans: { value: number; change: string; trend: string };
    emergencyAlerts: { value: number; change: string; trend: string };
    savedContacts: { value: number; change: string; trend: string };
    familyMembers: { value: number; change: string; trend: string };
  };
  qrCodeStatus: {
    active: boolean;
    lastGenerated: string;
    totalScans: number;
  };
  medicalProfileCompletion: { label: string; value: number }[];
  qrScanData: { month: string; scans: number; alerts: number }[];
  emergencyData: { month: string; scans: number; alerts: number }[];
  recentScans: { id: number; location: string; time: string; type: string }[];
  recentActivity: { id: number; title: string; desc: string; time: string; icon: string }[];
  emergencyContacts: any[];
}

export async function getDashboard() {
  return request<DashboardResponse>('/dashboard');
}

export interface PublicScanData {
  name: string;
  age: number;
  bloodGroup: string;
  avatarInitials: string;
  medicalConditions: string[];
  currentMedications: string[];
  allergies: string[];
  emergencyNotes: string;
  doctorInfo: string;
  primaryHospital: string;
  contacts: any[];
}

export async function getPublicScanData(id: string) {
  const url = `${API_BASE_URL}/public/scan/${id}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as PublicScanData;
}

export async function notifyEmergency(id: string, location?: string) {
  const url = `${API_BASE_URL}/public/scan/${id}/notify`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ location }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
}
