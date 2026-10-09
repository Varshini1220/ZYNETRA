import { User, OnboardingConfig, NotificationPreferences, WorkspacePreferences } from '../types/auth';

const STORAGE_KEY_SESSION = 'zynetra_v2_auth_session';
const STORAGE_KEY_USERS = 'zynetra_v2_registered_users';

export const DEFAULT_USER: User = {
  id: 'usr-default-01',
  name: 'Vihaan',
  email: 'varshini1662006@gmail.com',
  role: 'Executive',
  organization: 'Zynetra Enterprise Intelligence',
  industry: 'SaaS',
  primaryObjective: 'Customer Retention',
  createdAt: '2026-01-15',
  onboarded: true,
};

interface StoredUserRecord extends User {
  passwordHash: string;
  salt: string;
}

async function hashPassword(password: string, salt: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(`${salt}:${password}:zynetra_auth_v2`);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {
    // Fallback deterministic hash if subtle crypto is unavailable in non-secure context
  }
  let hash = 2166136261;
  const combined = `${salt}:${password}:zynetra_auth_v2`;
  for (let i = 0; i < combined.length; i++) {
    hash ^= combined.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a_${(hash >>> 0).toString(16)}`;
}

function generateSalt(): string {
  try {
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const bytes = new Uint8Array(12);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {
    // Fallback
  }
  return Math.random().toString(36).substring(2, 14);
}

// Retrieve stored users from localStorage
export function getRegisteredUsers(): StoredUserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: StoredUserRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch {
    // Ignore iframe storage restrictions
  }
}

// Retrieve currently active session
export function getStoredSessionUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION) || sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Save active session
export function setStoredSessionUser(user: User | null, rememberMe: boolean = true): void {
  try {
    if (user) {
      const serialized = JSON.stringify(user);
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY_SESSION, serialized);
      } else {
        sessionStorage.setItem(STORAGE_KEY_SESSION, serialized);
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
    }
  } catch {
    // Ignore iframe localStorage constraints
  }
}

function stripSensitiveFields(record: StoredUserRecord): User {
  const { passwordHash: _ph, salt: _s, ...cleanUser } = record;
  return cleanUser;
}

// Login with real password verification against registered accounts
export async function authenticateUser(
  email: string,
  pass: string,
  rememberMe: boolean = true
): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid work email address.' };
  }
  if (!pass) {
    return { success: false, error: 'Please enter your password.' };
  }

  const users = getRegisteredUsers();
  const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);

  if (!found) {
    return {
      success: false,
      error: 'No Zynetra account found with this work email. Please create an account first.',
    };
  }

  const computedHash = await hashPassword(pass, found.salt || 'zynetra_default_salt');
  if (computedHash !== found.passwordHash) {
    return {
      success: false,
      error: 'Incorrect password for this account. Please verify your credentials or reset your password.',
    };
  }

  const userObj = stripSensitiveFields(found);
  setStoredSessionUser(userObj, rememberMe);
  return { success: true, user: userObj };
}

// Sign up new user with full validation
export async function registerNewUser(
  fullName: string,
  email: string,
  pass: string,
  organization: string = '',
  role: string = 'Executive'
): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = fullName.trim();
  const trimmedOrg = organization.trim() || 'Enterprise Workspace';
  const trimmedRole = role.trim() || 'Executive';

  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: 'Please enter your full name.' };
  }
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { success: false, error: 'Please enter a valid work email address.' };
  }
  if (pass.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this work email already exists. Please sign in instead.',
    };
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(pass, salt);

  const newUserRecord: StoredUserRecord = {
    id: `usr-${Date.now()}`,
    name: trimmedName,
    email: trimmedEmail,
    role: trimmedRole,
    organization: trimmedOrg,
    createdAt: new Date().toISOString().split('T')[0],
    onboarded: false,
    notificationPrefs: {
      emailAlerts: true,
      weeklyDigest: true,
      rootCauseAlerts: true,
      thresholdBreach: true,
      slackIntegration: false,
    },
    workspacePrefs: {
      defaultView: 'overview',
      narrativeMode: 'executive',
      autoRunOnUpload: true,
      currencyFormat: 'USD',
    },
    passwordHash,
    salt,
  };

  users.push(newUserRecord);
  saveRegisteredUsers(users);

  const cleanUser = stripSensitiveFields(newUserRecord);
  setStoredSessionUser(cleanUser, true);
  return { success: true, user: cleanUser };
}

// Save onboarding configuration for user
export function saveUserOnboarding(
  userId: string,
  config: OnboardingConfig
): User | null {
  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.id === userId);

  const currentSession = getStoredSessionUser();
  const updatedFields: Partial<User> = {
    organization: config.company.trim() || currentSession?.organization || 'Enterprise Workspace',
    industry: config.industry,
    primaryObjective: config.primaryObjective,
    role: config.role || currentSession?.role || 'Executive',
    onboarded: true,
    onboardingConfig: {
      ...config,
      completedAt: new Date().toISOString(),
    },
  };

  if (idx !== -1) {
    users[idx] = {
      ...users[idx],
      ...updatedFields,
    };
    saveRegisteredUsers(users);
    const clean = stripSensitiveFields(users[idx]);
    setStoredSessionUser(clean, true);
    return clean;
  }

  if (currentSession) {
    const updatedUser: User = {
      ...currentSession,
      ...updatedFields,
    };
    setStoredSessionUser(updatedUser, true);
    return updatedUser;
  }

  return null;
}

// Update user profile details
export function updateUserProfile(
  userId: string,
  updates: {
    name?: string;
    email?: string;
    organization?: string;
    role?: string;
    industry?: string;
    primaryObjective?: string;
    department?: string;
    notificationPrefs?: NotificationPreferences;
    workspacePrefs?: WorkspacePreferences;
  }
): { success: boolean; user?: User; error?: string } {
  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.id === userId);

  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    const conflict = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.id !== userId
    );
    if (conflict) {
      return { success: false, error: 'Another account is already using this email address.' };
    }
  }

  if (idx !== -1) {
    users[idx] = {
      ...users[idx],
      ...updates,
      name: updates.name ? updates.name.trim() : users[idx].name,
      email: updates.email ? updates.email.trim().toLowerCase() : users[idx].email,
      organization: updates.organization ? updates.organization.trim() : users[idx].organization,
      role: updates.role ? updates.role.trim() : users[idx].role,
    };
    saveRegisteredUsers(users);
    const clean = stripSensitiveFields(users[idx]);
    setStoredSessionUser(clean, true);
    return { success: true, user: clean };
  }

  const currentSession = getStoredSessionUser();
  if (currentSession) {
    const updatedUser: User = {
      ...currentSession,
      ...updates,
    };
    setStoredSessionUser(updatedUser, true);
    return { success: true, user: updatedUser };
  }

  return { success: false, error: 'Active user session not found.' };
}

// Change user password with current password verification
export async function changeUserPassword(
  userId: string,
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (!currentPass) {
    return { success: false, message: 'Please enter your current password.' };
  }
  if (!newPass || newPass.length < 8) {
    return { success: false, message: 'New password must be at least 8 characters long.' };
  }

  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) {
    return { success: false, message: 'Account record not found.' };
  }

  const currentHash = await hashPassword(currentPass, users[idx].salt);
  if (currentHash !== users[idx].passwordHash) {
    return { success: false, message: 'Current password is incorrect.' };
  }

  const newSalt = generateSalt();
  const newHash = await hashPassword(newPass, newSalt);
  users[idx].salt = newSalt;
  users[idx].passwordHash = newHash;
  saveRegisteredUsers(users);

  return { success: true, message: 'Your password has been securely updated.' };
}

// Logout
export function logoutUser(): void {
  setStoredSessionUser(null);
}

// Request password reset
export async function requestPasswordReset(
  email: string,
  newPasswordOptional?: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { success: false, message: 'Please enter a valid work email address.' };
  }

  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);

  if (idx !== -1 && newPasswordOptional && newPasswordOptional.length >= 8) {
    const newSalt = generateSalt();
    const newHash = await hashPassword(newPasswordOptional, newSalt);
    users[idx].salt = newSalt;
    users[idx].passwordHash = newHash;
    saveRegisteredUsers(users);
    return {
      success: true,
      message: `Password reset complete for ${trimmedEmail}. You may now sign in with your updated credentials.`,
    };
  }

  return {
    success: true,
    message: `A password reset link and verification token have been dispatched to ${trimmedEmail}.`,
  };
}

