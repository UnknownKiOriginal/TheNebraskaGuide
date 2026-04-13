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
	const [isGuest, setIsGuest] = useState(
		storage.getBoolean('user.isGuest') || false
	);

	// Physical settings — stored in cm and kg as base units
	const [heightCm, setHeightCmState] = useState(
		storage.getNumber('settings.heightCm') || null
	);
	const [weightKg, setWeightKgState] = useState(
		storage.getNumber('settings.weightKg') || null
	);
	const [units, setUnitsState] = useState(
		storage.getString('settings.units') || 'imperial'
	);

	const setHeightCm = (val) => {
		setHeightCmState(val);
		if (val === null) storage.delete('settings.heightCm');
		else storage.set('settings.heightCm', val);
	};
	const setWeightKg = (val) => {
		setWeightKgState(val);
		if (val === null) storage.delete('settings.weightKg');
		else storage.set('settings.weightKg', val);
	};
	const setUnits = (val) => {
		setUnitsState(val);
		storage.set('settings.units', val);
	};

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
		setIsGuest(false);
		storage.set('user.name', username);
		storage.set('user.email', email);
		storage.set('user.isLoggedIn', true);
		storage.set('user.isGuest', false);
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
		setIsGuest(false);
		storage.set('user.name', displayName);
		storage.set('user.email', email);
		storage.set('user.isLoggedIn', true);
		storage.set('user.isGuest', false);
		return {success: true};
	};

	const loginAsGuest = () => {
		setUserName('Guest');
		setUserEmail('');
		setIsLoggedIn(false);
		setIsGuest(true);
		storage.set('user.name', 'Guest');
		storage.delete('user.email');
		storage.set('user.isLoggedIn', false);
		storage.set('user.isGuest', true);
	};

	const logout = () => {
		setUserName('Guest');
		setUserEmail('');
		setIsLoggedIn(false);
		setIsGuest(false);
		storage.delete('user.name');
		storage.delete('user.email');
		storage.set('user.isLoggedIn', false);
		storage.set('user.isGuest', false);
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

	// Location ratings — stores total and count per location for satisfaction calculation
	const [locationRatings, setLocationRatingsState] = useState(() => {
		const stored = storage.getString('locationRatings');
		return stored ? JSON.parse(stored) : {};
	});

	// Returns the user's existing rating for a location, or null if they haven't rated
	const getUserRating = (locationName) => {
		const key = userEmail || 'guest';
		const stored = storage.getString(`userRatingValues.${key}`);
		const values = stored ? JSON.parse(stored) : {};
		return values[locationName] ?? null;
	};

	// rating=null means remove the user's rating entirely
	const submitRating = (locationName, rating) => {
		const key = userEmail || 'guest';
		const stored = storage.getString(`userRatingValues.${key}`);
		const values = stored ? JSON.parse(stored) : {};
		const previousRating = values[locationName] ?? null;
		const current = locationRatings[locationName] || {total: 0, count: 0};

		let newTotal = current.total;
		let newCount = current.count;

		if (rating === null) {
			// Remove rating: subtract previous value and decrement count
			if (previousRating === null) return {success: true}; // nothing to remove
			newTotal = current.total - Number(previousRating);
			newCount = Math.max(0, current.count - 1);
			const newValues = {...values};
			delete newValues[locationName];
			storage.set(`userRatingValues.${key}`, JSON.stringify(newValues));
		} else if (previousRating !== null) {
			// Replace existing rating
			newTotal = current.total - Number(previousRating) + Number(rating);
			storage.set(`userRatingValues.${key}`, JSON.stringify({...values, [locationName]: Number(rating)}));
		} else {
			// First rating
			newTotal = current.total + Number(rating);
			newCount = current.count + 1;
			storage.set(`userRatingValues.${key}`, JSON.stringify({...values, [locationName]: Number(rating)}));
		}

		const updated = {
			...locationRatings,
			[locationName]: {total: newTotal, count: newCount},
		};
		setLocationRatingsState(updated);
		storage.set('locationRatings', JSON.stringify(updated));
		return {success: true};
	};

	const getSatisfaction = (locationName) => {
		const data = locationRatings[locationName];
		if (!data || data.count === 0) return 0;
		return Math.round((data.total / data.count) * 10);
	};

	return (
		<AppContext.Provider value={{
			userName, userEmail, isLoggedIn, isGuest,
			register, login, loginAsGuest, logout,
			changePassword, resetPassword,
			heightCm, weightKg, units, setHeightCm, setWeightKg, setUnits,
			favorites, addFavorites, removeFavorites,
			communityPosts, setCommunityPosts,
			submitRating, getSatisfaction, getUserRating,
		}}>
			{children}
		</AppContext.Provider>
	);
};
