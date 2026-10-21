const STORAGE_KEY = 'exercise_2_users';

const INITIAL_USERS = [
  { id: 1, name: 'Sanket Bhandekar', email: 'sanket.bhandekar@example.com', role: 'Admin' },
  { id: 2, name: 'Mangesh Ladke', email: 'mangesh.ladke@example.com', role: 'Developer' },
  { id: 3, name: 'Vinay Gahane', email: 'vinay.gahane@example.com', role: 'Editor' },
  { id: 4, name: 'Vishal Khedekar', email: 'vishal.khedekar@example.com', role: 'Developer' },
  { id: 5, name: 'Chetan Falke', email: 'chetan.falke@example.com', role: 'Manager' },
  { id: 6, name: 'Chetan Kshirsagar', email: 'chetan.kshirsagar@example.com', role: 'Viewer' },
];

let simulateDeleteError = false;

export const setSimulateDeleteError = (val) => {
  simulateDeleteError = Boolean(val);
};

export const getSimulateDeleteError = () => simulateDeleteError;

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const getUsersFromStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS;
  }
};

const saveUsersToStorage = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export async function fetchUsers() {
  await delay(1500);
  return getUsersFromStorage();
}

export async function createUser(userData) {
  await delay(1000);
  const users = getUsersFromStorage();
  const newUser = {
    id: Date.now(),
    name: userData.name.trim(),
    email: userData.email.trim(),
    role: userData.role || 'Viewer',
  };
  saveUsersToStorage([newUser, ...users]);
  return newUser;
}

export async function deleteUser(id) {
  await delay(1200);

  if (simulateDeleteError) {
    throw new Error('Server error: Failed to delete user.');
  }

  const users = getUsersFromStorage();
  saveUsersToStorage(users.filter((u) => u.id !== id));
  return id;
}

export function resetUsers() {
  saveUsersToStorage(INITIAL_USERS);
  return INITIAL_USERS;
}
