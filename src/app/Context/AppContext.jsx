import * as React from 'react';
import {createContext, useState} from 'react';
import {storage} from '../Services/Storage';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
	const [userName, setUserName] = useState(
		storage.getString('user.name') || 'Guest'
	);
	const [userEmail, setUserEmail] = useState(
		storage.getString('user.email') || ''
	);
	const [isLoggedIn, setIsLoggedIn] = useState(
		storage.getBoolean('user.isLoggedIn') || false
	);

	// Stores account under account.<email>.username / .password
	const register = (email, password, username) => {
		const key = email.toLowerCase().trim();
		if (storage.getString(`account.${key}.password`)) {
			return {success: false, error: 'An account with that email already exists.'};
		}
		storage.set(`account.${key}.username`, username);
		storage.set(`account.${key}.password`, password);
		setUserName(username);
		setUserEmail(email);
		setIsLoggedIn(true);
		storage.set('user.name', username);
		storage.set('user.email', email);
		storage.set('user.isLoggedIn', true);
		return {success: true};
	};

	const login = (email, password, username) => {
		const key = email.toLowerCase().trim();
		const storedPassword = storage.getString(`account.${key}.password`);
		const storedUsername = storage.getString(`account.${key}.username`);
		if (!storedPassword || storedPassword !== password) {
			return {success: false};
		}
		if (username && storedUsername && storedUsername.toLowerCase() !== username.toLowerCase()) {
			return {success: false};
		}
		const displayName = storedUsername || username;
		setUserName(displayName);
		setUserEmail(email);
		setIsLoggedIn(true);
		storage.set('user.name', displayName);
		storage.set('user.email', email);
		storage.set('user.isLoggedIn', true);
		return {success: true};
	};

	const loginAsGuest = () => {
		setUserName('Guest');
		setUserEmail('');
		setIsLoggedIn(false);
		storage.set('user.name', 'Guest');
		storage.delete('user.email');
		storage.set('user.isLoggedIn', false);
	};

	const logout = () => {
		setUserName('Guest');
		setUserEmail('');
		setIsLoggedIn(false);
		storage.delete('user.name');
		storage.delete('user.email');
		storage.set('user.isLoggedIn', false);
	};

	// Verifies current password then updates to new one
	const changePassword = (currentPassword, newPassword) => {
		const key = userEmail.toLowerCase().trim();
		const storedPassword = storage.getString(`account.${key}.password`);
		if (storedPassword !== currentPassword) {
			return {success: false, error: 'Current password is incorrect.'};
		}
		storage.set(`account.${key}.password`, newPassword);
		return {success: true};
	};

	// Resets password for any email without needing current password (local recovery)
	const resetPassword = (email, newPassword) => {
		const key = email.toLowerCase().trim();
		if (!storage.getString(`account.${key}.password`)) {
			return {success: false, error: 'No account found with that email.'};
		}
		storage.set(`account.${key}.password`, newPassword);
		return {success: true};
	};

	// Favorites — stored as JSON array in MMKV
	const [favorites, setFavorites] = useState(() => {
		const stored = storage.getString('favorites');
		return stored ? JSON.parse(stored) : [];
	});

	const addFavorites = (location) => {
		const updated = [...favorites, location];
		setFavorites(updated);
		storage.set('favorites', JSON.stringify(updated));
	};

	const removeFavorites = (locationName) => {
		const updated = favorites.filter(f => f.name !== locationName);
		setFavorites(updated);
		storage.set('favorites', JSON.stringify(updated));
	};

	// Community posts — stored as JSON object keyed by location name
	const [communityPosts, setCommunityPostsState] = useState(() => {
		const stored = storage.getString('communityPosts');
		return stored ? JSON.parse(stored) : {};
	});

	const setCommunityPosts = (updater) => {
		const updated = typeof updater === 'function' ? updater(communityPosts) : updater;
		setCommunityPostsState(updated);
		storage.set('communityPosts', JSON.stringify(updated));
	};

	return (
		<AppContext.Provider value={{
			userName, userEmail, isLoggedIn,
			register, login, loginAsGuest, logout,
			changePassword, resetPassword,
			favorites, addFavorites, removeFavorites,
			communityPosts, setCommunityPosts,
		}}>
			{children}
		</AppContext.Provider>
	);
};