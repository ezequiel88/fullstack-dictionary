// Authentication actions
export { loginAction } from "./login";
export { registerAction } from "./register";
export { logoutAction, logoutAndRedirect } from "./logout";

// User actions
export { getUserProfile, getUserHistory, getUserFavorites } from "./user";

// Dictionary actions
export { searchWord, getWordsList } from "./dictionary";

// Favorites actions
export { markAsFavorite, removeFavorite, getFavorites } from "./favorite";

// History actions
export { getHistory, clearHistory } from "./history";