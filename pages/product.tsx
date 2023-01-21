import { FormEvent, useContext, useEffect, useState } from 'react';
import Fetch from '../utils/fetch';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Product, ProductCategory } from '../types/types';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const [values, setValues] = useState({ code: '', name: '', description: '', buyAt: '', sellAt: '', stock: 0, category: 'Food goods'} as Product);
  const [accErr, setAccErr] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const id = router.query.id as string;

  const authContext = useContext(AuthContext);

  useEffect(()=> {
    async function getProduct() {
      if (!authContext.appHasLoaded) return;
      if (!id) return setLoading(false);

      const product = await Fetch(`api/product?_id=${id}&token=${authContext.user.token}`).catch(()=>{});
      if (product && product._id) setValues(product);
      setLoading(false);
    }
    getProduct();
  }, [ authContext.appHasLoaded ]);

  async function submit(e: FormEvent) {
    e.preventDefault(); // @ts-ignore 
    try {
      await Fetch(`api/product?token=${authContext.user.token}`, {...values, _id: id});
      router.push('/storage');
    } catch (err: any) {
      setAccErr(err.message);
    }
  }

  const spinner = <div className='spinner-border text-primary' role="status"><span className="visually-hidden">Loading...</span></div>;

  return (
    <div className='d-flex justify-content-center align-items-center w-100 min-vh-100'>
      { loading ? spinner : <form onSubmit={ submit } style={{ width: '300px' }}>
          <div className='mb-3'>
            <label htmlFor='code' className='col-form-label'>Code:</label>
            <input type='text' className='form-control' id='code' maxLength={5} required value={values.code} onChange={e => setValues({...values, code: e.target.value})}/>
          </div>
          <div className='mb-3'>
            <label htmlFor='name' className='col-form-label'>Name:</label>
            <input type='text' className='form-control' id='name' required maxLength={50} value={values.name} onChange={e => setValues({...values, name: e.target.value})}/>
          </div>
          <div className='mb-3'>
            <label htmlFor='description' className='col-form-label'>Description:</label>
            <textarea className='form-control' id='description' maxLength={2000} value={values.description} onChange={e => setValues({...values, description: e.target.value})}></textarea>
          </div>
          <div className='mb-3'>
            <label htmlFor='cost' className='col-form-label'>By at price:</label>
            <input type='text' className='form-control' id='cost' required value={values.buyAt} onChange={e => setValues({...values, buyAt: e.target.value})}/>
          </div>
          <div className='mb-3'>
            <label htmlFor='price' className='col-form-label'>Sell at price:</label>
            <input type='text' className='form-control' id='price' required value={values.sellAt} onChange={e => setValues({...values, sellAt: e.target.value})}/>
          </div>
          <div className='mb-3'>
            <label htmlFor='stock' className='col-form-label'>Stock:</label>
            <input type='number' className='form-control' id='stock' required min={0} value={values.stock} onChange={e => setValues({...values, stock: Number(e.target.value)})}/>
          </div>
          <div className='mb-3'>
            <label htmlFor='category' className='form-label'>Category</label>
            <select name="category" id="category" className='form-select' value={values.category} onChange={e => setValues({...values, category: e.target.value as ProductCategory})}>
              <option value="Food goods">Food goods</option>
              <option value="Building materials">Building materials</option>
              <option value="Chancery materials">Chancery materials</option>
            </select>
          </div>
          
          <button className='btn btn-primary mb-2' style={{ width: '100%' }}>{ id ? 'Edit product' : 'Add product' }</button>
          <Link href='/storage' className='btn btn-danger mb-2' style={{ width: '100%' }}>Cancel</Link>
          { accErr && <div className='text-danger'>{ accErr }</div> }
        </form>
      }
    </div>
  )
}
