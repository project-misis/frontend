import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type AuthRole = "user" | "mentor";

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	role: AuthRole;
	avatarUrl?: string;
	expertise?: string; // mentor-only
	interests?: string; // user-only
	createdAt: string;
	updatedAt: string;
};

type SignupInput =
	| { role: "mentor"; name: string; email: string; password: string; avatarUrl?: string; expertise?: string }
	| { role: "user"; name: string; email: string; password: string; avatarUrl?: string; interests?: string };

type LoginInput = { email: string; password: string };

type UpdateProfileInput = Partial<Omit<AuthUser, "id" | "createdAt" | "updatedAt" | "role">> & {
	expertise?: string;
	interests?: string;
	name?: string;
};

type AuthContextValue = {
	user: AuthUser | null;
	loading: boolean;
	isProfileOpen: boolean;
	openProfile: () => void;
	closeProfile: () => void;
	signup: (input: SignupInput) => Promise<AuthUser>;
	login: (input: LoginInput) => Promise<AuthUser>;
	logout: () => Promise<void>;
	updateProfile: (updates: UpdateProfileInput) => Promise<AuthUser>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "app_auth_user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	useEffect(() => {
		const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
		if (raw) {
			try {
				setUser(JSON.parse(raw));
			} catch {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (user) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
		} else {
			localStorage.removeItem(STORAGE_KEY);
		}
	}, [user]);

	const simulateNetwork = useCallback(async () => {
		await new Promise((r) => setTimeout(r, 400));
	}, []);

	const signup = useCallback(async (input: SignupInput) => {
		await simulateNetwork();
		const now = new Date().toISOString();
		const created: AuthUser = {
			id: crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
			name: input.name,
			email: input.email,
			role: input.role,
			avatarUrl: input.avatarUrl,
			expertise: input.role === "mentor" ? input.expertise : undefined,
			interests: input.role === "user" ? input.interests : undefined,
			createdAt: now,
			updatedAt: now,
		};
		setUser(created);
		return created;
	}, [simulateNetwork]);

	const login = useCallback(async (input: LoginInput) => {
		await simulateNetwork();
		// Without backend, log in as last saved user if emails match; otherwise, create a placeholder user
		const now = new Date().toISOString();
		let next = user;
		if (!next || next.email !== input.email) {
			next = {
				id: crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
				name: input.email.split("@")[0],
				email: input.email,
				role: "user",
				createdAt: now,
				updatedAt: now,
			};
		} else {
			next = { ...next, updatedAt: now };
		}
		setUser(next);
		return next;
	}, [simulateNetwork, user]);

	const logout = useCallback(async () => {
		await simulateNetwork();
		setUser(null);
	}, [simulateNetwork]);

	const updateProfile = useCallback(async (updates: UpdateProfileInput) => {
		if (!user) throw new Error("Not authenticated");
		await simulateNetwork();
		const next: AuthUser = {
			...user,
			...updates,
			updatedAt: new Date().toISOString(),
		};
		setUser(next);
		return next;
	}, [simulateNetwork, user]);

	const value = useMemo<AuthContextValue>(() => ({
		user,
		loading,
		isProfileOpen,
		openProfile: () => setIsProfileOpen(true),
		closeProfile: () => setIsProfileOpen(false),
		signup,
		login,
		logout,
		updateProfile,
	}), [user, loading, isProfileOpen, signup, login, logout, updateProfile]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};



