import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import bcrypt from 'bcrypt';
import { User, ErrorRes } from '../../types/types';
import jwt from 'jsonwebtoken';
import apiErr from '../../utils/handleApiError';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User|ErrorRes>
) {
  const { username, password, email, phone } = JSON.parse(req.body) || {};
  if (!username || !password || !email) return await apiErr(res, 400, 'Username, Password or email missing');
  
  const db = await dbConnect();
  const existingUser = await db.collection('users').findOne({ $or: [ { username }, { email } ] });
  if (existingUser) return await apiErr(res, 400, 'User already exists');

  const hashedPass = await bcrypt.hash(password, 10);

  const result = await db.collection('users').insertOne({ username, password: hashedPass, email, phone });
  
  if (!result) return await apiErr(res, 500, 'Internal server error');
  
  //@ts-ignore
  const user = (await db.collection('users').findOne({ _id: result.insertedId })) as User;
  user.token = jwt.sign(user, process.env.JWT_SECRET || 'heloo', { expiresIn: '1h' });
  delete user.password;

  res.status(200).json(user);
}
