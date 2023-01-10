import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import bcrypt from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { username, password, email, phone } = JSON.parse(req.body) || {};
  if (!username || !password || !email) return res.status(400).json({ error: 'Username, Password or email missing' });
  
  const db = await dbConnect();
  const existingUser = await db.collection('users').findOne({ $or: [ { username }, { email } ] });
  if (existingUser) return res.status(400).json({ error: 'User already exists' });

  const hashedPass = await bcrypt.hash(password, 10);

  const user = await db.collection('users').insertOne({ username, password: hashedPass, email, phone });
  
  if (!user) return res.status(500).json({ error: 'Internal server error' });
  
  res.status(200).json(user);
}
