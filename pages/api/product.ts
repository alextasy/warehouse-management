import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import { Product } from '../../types/types';
import jwt from 'jsonwebtoken';
import apiErr from '../../utils/handleApiError';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const db = await dbConnect();
  const token = req.query.token as string;

  try {
   jwt.verify(token, process.env.JWT_SECRET || 'heloo');
  } catch (err) {
    return await apiErr(res, 401, 'Authentication error');
  }

  if (req.method === 'POST') await handlePost();
  else if (req.method === 'GET') await handleGet();
  else if (req.method === 'DELETE') await handleDelete();

  async function handlePost() {
    const body = JSON.parse(req.body) as Product;
    if (!body.name || !body.code || !body.sellAt || !body.buyAt || !body.category || (!body.stock && body.stock !== 0)) 
    return await apiErr(res, 400, 'Form not submitted properly - missing data');

    const _id = body._id ? ObjectId.createFromHexString(body._id as string) : null;
    delete body._id;

    let product = null;
    
    if (!_id) {
      const data = await db.collection('products').findOne({ code: body.code });
      if (data) return  await apiErr(res, 404, `Product with the code: "${body.code}" already exists`); //@ts-ignore
      product = await db.collection('products').insertOne(body);
    } else product = await db.collection('products').updateOne({ _id }, { $set: body });

    if (!product) return await apiErr(res, 500, `Internal server error`);

    res.status(200).json(product);
  }

  async function handleGet() {
    const query = {...req.query} as any;
    delete query.token;
    if (query.name) query.name = { $regex: query.name, $options: 'i' };

    let data = null;

    if (query._id)  {
      const _id = ObjectId.createFromHexString(query._id as string);
      data = await db.collection('products').findOne({ _id });
    } else data = await db.collection('products').find(query).toArray();

    res.status(200).json(data);
  }

  async function handleDelete() {
    const _id = req.query._id as string;
    
    if (!_id) return await apiErr(res, 400, `_id is a required argument`);

    const data = await db.collection('products').deleteOne({ _id: ObjectId.createFromHexString(_id) });

    res.status(200).json(data);
  }

}
