import { User } from '../types/auth';

const STORAGE_KEY_SESSION = 'zynetra_auth_session';
const STORAGE_KEY_USERS = 'zynetra_registered_users';

export const DEFAULT_USER: User = {
  id: 'usr-default-01',
  name: 'Vihaan',
  email: 'varshini1662006@gmail.com',
  role: 'Lead Data Strategist & VP Analytics',
  organization: 'Acme Global Intelligence Corp',
  createdAt: '2026-01-15',
};

// Retrieve stored users from localStorage
export function getRegisteredUsers(): Array<User & { passwordHash: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      // Seed default user
      const initial = [
        {
          ...DEFAULT_USER,
          passwordHash: 'password123',
        },
      ];
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [{ ...DEFAULT_USER, passwordHash: 'password123' }];
  }
}

// Retrieve currently active session
export function getStoredSessionUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// Save active session
export function setStoredSessionUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  } catch (e) {
    // Ignore iframe localStorage constraints
  }
}

// Login
export async function authenticateUser(
  email: string,
  pass: string,
  rememberMe: boolean = true
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate network latency for authentic feel
  await new Promise((resolve) => setTimeout(resolve, 350));

  const trimmedEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();

  // Check demo shortcut or registered user
  const found = users.find(
    (u) => u.email.toLowerCase() === trimmedEmail && (u.passwordHash === pass || pass === 'password123' || pass === 'demo')
  );

  if (found) {
    const userObj: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      organization: found.organization,
      avatarUrl: found.avatarUrl,
      createdAt: found.createdAt,
    };
    if (rememberMe) {
      setStoredSessionUser(userObj);
    }
    return { success: true, user: userObj };
  }

  // If email matches default demo email regardless of initial password
  if (trimmedEmail === 'varshini1662006@gmail.com' || trimmedEmail === 'demo@zynetra.ai') {
    const userObj = { ...DEFAULT_USER, email: trimmedEmail };
    if (rememberMe) setStoredSessionUser(userObj);
    return { success: true, user: userObj };
  }

  return { success: false, error: 'Invalid email or password. You can click "Instant Demo Access" or register a new account.' };
}

// Sign up new user
export async function registerNewUser(
  fullName: string,
  email: string,
  pass: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = fullName.trim();

  if (!trimmedName) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (pass.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (existing) {
    return { success: false, error: 'An account with this email address already exists. Please sign in.' };
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name: trimmedName,
    email: trimmedEmail,
    role: 'Enterprise Member & Analyst',
    organization: 'Acme Enterprise',
    createdAt: new Date().toISOString().split('T')[0],
  };

  users.push({
    ...newUser,
    passwordHash: pass,
  });

  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    // Ignore storage errors
  }

  setStoredSessionUser(newUser);
  return { success: true, user: newUser };
}

// Logout
export function logoutUser(): void {
  setStoredSessionUser(null);
}

// Request password reset simulation
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  return {
    success: true,
    message: `A secure password reset link has been dispatched to ${trimmedEmail}. Valid for the next 30 minutes.`,
  };
}
