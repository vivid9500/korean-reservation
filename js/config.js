// 전역 config 객체 생성
window.config = {
    async loadConfig() {
        try {
            const response = await fetch('https://api.github.com/gists/b59077b636f7e694d5da137d7faf932d');
            const gist = await response.json();
            const envContent = gist.files['.env'].content;
            
            // 디버깅: 설정 값 확인
            console.log('Loaded config:', envContent);
            
            const config = {};
            envContent.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    config[key.trim()] = value.trim();
                }
            });
            
            // 디버깅: 파싱된 설정 확인
            console.log('Parsed config:', config);
            return config;
        } catch (e) {
            console.error('Config loading error:', e);
            return {};
        }
    }
};