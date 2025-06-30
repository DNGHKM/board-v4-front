import {fetchLogin, fetchSignUp, validToken} from "@/api/authApi";
import useAuthStore from "@/store/authStore";


/*
store는 로직 없이 상태만 가지는 구조로 유지,
 로그인, 회원가입 등 로직, localStorage 등 토큰 저장소 접근은 서비스에서 관리
 HOOK(?)
 */

export const login = async ({username, password}, onSuccess) => {
    try {
        const {accessToken, username: fetchedUsername, name} = await fetchLogin({username, password});

        localStorage.setItem("token", accessToken);
        useAuthStore.getState().setAuth({username: fetchedUsername, name});

        alert(`환영합니다. ${name}님`);
        if (onSuccess) onSuccess();
    } catch (err) {
        const message = err.response?.data?.message || "로그인 중 문제가 발생했습니다.";
        alert(message);
        throw err;
    }
};


export const signUp = async (form, onSuccess) => {
    try {
        const {accessToken, username, name} = await fetchSignUp(form);

        // 토큰 저장 및 상태 업데이트
        localStorage.setItem("token", accessToken);
        useAuthStore.getState().setAuth({username, name});

        alert(`회원가입 성공! ${name}님`);
        if (onSuccess) onSuccess();
    } catch (err) {
        const message = err.response?.data?.message || "회원가입 중 문제가 발생했습니다.";
        alert(message);
        throw err;
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    useAuthStore.getState().clearAuth();
};

export const restoreLogin = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const {username, name} = await validToken({token});
        useAuthStore.getState().setAuth({username, name});
    } catch {
        localStorage.removeItem("token");
        useAuthStore.getState().clearAuth();
    }
};