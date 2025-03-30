class Auth {
    constructor() {
        this.isAuthenticated = false;
        this.checkAuth();
    }

    checkAuth() {
        const token = sessionStorage.getItem('admin_token');
        if (!token) {
            this.redirectToLogin();
            return false;
        }

        // 토큰 유효성 검증
        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            if (tokenData.exp < Date.now() / 1000) {
                this.logout();
                return false;
            }
        } catch (e) {
            this.logout();
            return false;
        }

        return true;
    }

    async login(username, password) {
        try {
            // Firebase, Auth0 등의 인증 서비스를 사용하는 것을 추천합니다
            // 여기서는 예시로 GitHub Gist에 저장된 해시된 비밀번호와 비교하는 방식을 보여드립니다
            const response = await fetch('https://api.github.com/gists/b59077b636f7e694d5da137d7faf932d.js');
            const gist = await response.json();
            const adminData = JSON.parse(gist.files['admin-auth.json'].content);
            
            // 비밀번호 해시 비교
            const hashedPassword = await this.hashPassword(password);
            if (username === adminData.username && hashedPassword === adminData.password) {
                const token = this.generateToken(username);
                sessionStorage.setItem('admin_token', token);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Login error:', e);
            return false;
        }
    }

    async hashPassword(password) {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    generateToken(username) {
        // 간단한 JWT 형식 토큰 생성
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1시간 유효
        }));
        const signature = this.hashString(`${header}.${payload}`);
        return `${header}.${payload}.${signature}`;
    }

    logout() {
        sessionStorage.removeItem('admin_token');
        this.redirectToLogin();
    }

    redirectToLogin() {
        window.location.href = '/admin/login.html';
    }
} 