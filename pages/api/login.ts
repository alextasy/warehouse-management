import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import bcrypt from 'bcrypt';
import { ErrorRes, User } from '../../types/types';
import jwt from 'jsonwebtoken';
import apiErr from '../../utils/handleApiError';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User|ErrorRes>
) {
  const { username, password } = JSON.parse(req.body) || {};
  if (!username || !password) return await apiErr(res, 400, 'Username or Password missing');
  
  const db = await dbConnect();
  const data = await db.collection('users').findOne({ username });
  if (!data) return await apiErr(res, 404, `User "${username}" doesn't exist`);

  const passwordsMatch = await bcrypt.compare(password, data.password);
  if (!passwordsMatch) return await apiErr(res, 404, 'Wrong password');

  data.token = jwt.sign(data, process.env.JWT_SECRET || 'heloo', { expiresIn: '1h' });

  delete data.password; //@ts-ignore
  res.status(200).json(data as User);
}
