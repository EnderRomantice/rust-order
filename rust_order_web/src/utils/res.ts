const URL = ""

export async function res(method: string, url: string, data: {[key: string]: any} = {}) {
    try {
        console.log(`API 请求: ${method} ${url}`, data);
        
        if (method === 'GET') {
            const params = Object.keys(data).map(v => `${v}=${encodeURIComponent(data[v])}`).join('&');
            const fullUrl = params ? `${URL}${url}?${params}` : `${URL}${url}`;
            
            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }

        const response = await fetch(`${URL}${url}`, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API 请求失败: ${method} ${url}`, error);
        throw error;
    }
}