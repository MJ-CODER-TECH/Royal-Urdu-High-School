const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";
const USER = "user";

export const saveTokens = (
    accessToken,
    refreshToken,
    remember = true
) => {

    const storage = remember
        ? localStorage
        : sessionStorage;

    storage.setItem(ACCESS_TOKEN, accessToken);

    if (refreshToken) {
        storage.setItem(
            REFRESH_TOKEN,
            refreshToken
        );
    }

};

export const saveUser = (user, remember = true) => {

    const storage = remember
        ? localStorage
        : sessionStorage;

    storage.setItem(
        USER,
        JSON.stringify(user)
    );

};

export const getAccessToken = () => {

    return (
        localStorage.getItem(ACCESS_TOKEN) ||
        sessionStorage.getItem(ACCESS_TOKEN)
    );

};

export const getRefreshToken = () => {

    return (
        localStorage.getItem(REFRESH_TOKEN) ||
        sessionStorage.getItem(REFRESH_TOKEN)
    );

};

export const getUser = () => {

    const user =
        localStorage.getItem(USER) ||
        sessionStorage.getItem(USER);

    return user ? JSON.parse(user) : null;

};

export const clearTokens = () => {

    localStorage.clear();
    sessionStorage.clear();

};