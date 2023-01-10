export default async function(url: string, body: any = null, method = 'GET'): Promise<any> {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000/';
    try {
        const params = body ? { body: JSON.stringify(body), method: 'POST' } : { method };
        const res = await fetch(`${baseUrl}${url}`, params);
        const data = await res.json();
        if (data?.error) throw Error(data.error);
        return data;
    } catch (err: any) {
        throw Error(err);
    }
}