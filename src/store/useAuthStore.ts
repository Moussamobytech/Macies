import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (updatedFields: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('macies_user') || 'null'),
  token: localStorage.getItem('macies_token') || null,
  setAuth: (user, token) => {
    localStorage.setItem('macies_user', JSON.stringify(user));
    localStorage.setItem('macies_token', token);
    set({ user, token });
  },
  updateUser: (updatedFields) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updatedFields };
      localStorage.setItem('macies_user', JSON.stringify(newUser));
      return { user: newUser };
    });
  },
  logout: () => {
    localStorage.removeItem('macies_user');
    localStorage.removeItem('macies_token');
    set({ user: null, token: null });
  },
}));
