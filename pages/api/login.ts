import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import bcrypt from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { username, password } = JSON.parse(req.body) || {};
  if (!username || !password) return res.status(400).json({ error: 'Username or Password missing' });
  
  const db = await dbConnect();
  const data = await db.collection('users').findOne({ username });
  if (!data) return res.status(404).json({ error: `User "${username}" doesn't exist` });

  const passwordsMatch = await bcrypt.compare(password, data.password);
  if (!passwordsMatch) return res.status(404).json({ error: 'Wrong password' });

  res.status(200).json(data);
}
