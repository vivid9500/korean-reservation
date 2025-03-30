const config = {
    async loadConfig() {
        try {
            // GitHub Gist나 다른 안전한 저장소에서 설정 로드
            const response = await fetch('https://api.github.com/gists/b59077b636f7e694d5da137d7faf932d.js');
            const gist = await response.json();
            return JSON.parse(gist.files['config.json'].content);
        } catch (e) {
            console.error('Config loading error:', e);
            return {};
        }
    }
};