
import { API } from "./axios";


export const signup = async (signupData) => {
    const response = await API.post("/auth/signup", signupData);
    return response.data;
};
export const login = async (loginData) => {
    const response = await API.post("/auth/login", loginData);
    return response.data;
};

export const logout = async () => {
    const response = await API.post("/auth/logout");
    return response.data;
};

export const getAuthUser = async () => {
    try {
        const res = await API.get("/auth/me")
        return res.data;
    } catch (error) {
        return null;
    }
};

export const completeOnboarding = async (userData) => {
    const res = await API.post("/auth/onboarding", userData);
    return res.data;
};

export const getUserFriends = async () => {
    try {
        const res = await API.get("/users/friends")
        return res.data;
    } catch (error) {
        return null;
    }
}

export const getRecommendedUsers = async () => {
    try {
        const res = await API.get("/users")
        return res.data;
    } catch (error) {
        return null;
    }
}

export const getOutgoingFriendReqs = async () => {
    try {
        const res = await API.get("/users/outgoing-friend-requests")
        return res.data;
    } catch (error) {
        return null;
    }
};

export const sendFriendRequest = async (userId) => {
    try {
        const res = await API.post(`/users/friend-request/${userId}`)
        return res.data;
    } catch (error) {
        return null;
    }
}

export const getFriendRequests = async () => {
    try {
        const res = await API.get(`/users/friend-requests`)
        return res.data;
    } catch (error) {
        return null;
    }
};


export const acceptFriendRequests = async (requestId) => {
    try {
        const res = await API.put(`/users/friend-request/${requestId}/accept`)
        return res.data;
    } catch (error) {
        return null;
    }
}

export const getStreamToken = async()=>{
    const response = await API.get("/chat/token");
    return response.data;
}