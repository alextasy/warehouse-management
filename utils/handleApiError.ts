import { promises as fs } from 'fs';
import { NextApiResponse } from 'next';
import { ErrorRes } from '../types/types';

export default async function handleApiError(res: NextApiResponse<ErrorRes>, status: number, message: string,) {
    const date = new Date().toLocaleString();
    const log = `\n[${date}] ${message}`;
    await fs.appendFile('./logs/logs.txt', log);
    res.status(status).json({ error: message });
}

