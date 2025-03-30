// Auth 클래스를 전역으로 정의
window.Auth = class Auth {
    constructor() {
        this.isAuthenticated = false;
        this.checkAuth();
    }

    async checkAuth() {
        const token = sessionStorage.getItem('admin_token');
        if (!token) {
            return false;
        }

        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            if (tokenData.exp < Date.now() / 1000) {
                this.logout();
                return false;
            }
            return true;
        } catch (e) {
            this.logout();
            return false;
        }
    }

    async login(username, password) {
        try {
            const config = await window.config.loadConfig();
            console.log('Login attempt:', {
                inputUsername: username,
                storedUsername: config.ADMIN_USERNAME,
                matches: username === config.ADMIN_USERNAME
            });

            if (username === config.ADMIN_USERNAME && 
                password === config.ADMIN_PASSWORD_HASH) {
                const token = this.generateToken(username);
                sessionStorage.setItem('admin_token', token);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Login error:', e);
            throw e;
        }
    }

    generateToken(username) {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        }));
        const signature = btoa(username);
        return `${header}.${payload}.${signature}`;
    }

    logout() {
        sessionStorage.removeItem('admin_token');
        window.location.href = 'login.html';
    }
} 