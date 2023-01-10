import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/storage.module.css';
import { useRouter } from 'next/router';
import Fetch from '../utils/fetch';
import { Product } from '../types/types';

export default function Home() {
  const [input, setInput] = useState({ code: '', name: '', category: 'All' });
  const [results, setResults] = useState([] as Product[]);
  const router = useRouter();
  const [toBeDeleted, setToBeDeleted] = useState({} as Product);

  async function search() {
    const params = new URLSearchParams();
    if (input.code) params.append('code', input.code);
    else {
      if (input.name) params.append('name', input.name);
      if (input.category !== 'All') params.append('category', input.category);
    }

    const products = await Fetch(`api/product?` + params).catch(()=>{});
    if (products) setResults(products);
  }

  useEffect(()=> { search(); }, []);

  function editProduct(id: string) {
    router.push(`/product?id=${id}`);
  }

  async function deleteProductClick(product: Product) {
    setToBeDeleted(product);
    const Modal = (await import('bootstrap')).Modal;
    const myModalAlternative = new Modal('#deleteModal');
    myModalAlternative.show();
  }

  async function deleteProduct(doDelete: boolean) {
    if (!doDelete) return setToBeDeleted({} as Product);

    const data = await Fetch(`/api/product?_id=${toBeDeleted._id}`, null, 'DELETE');
    if (data && data.deletedCount === 1) setResults(results.filter(result => result._id !== toBeDeleted._id));
    setToBeDeleted({} as Product);
  }

  const tableInfo = results.map((product: any) => {
    return <tr key={product.code}>
      <th scope='row'>{ product.code }</th>
      <td>{ product.stock }</td>
      <td>{ product.category }</td>
      <td>{ product.name }</td>
      <td className='text-warning fw-bold' style={{cursor: 'pointer'}} onClick={()=> editProduct(product._id)}>Edit</td>
      <td className='text-danger fw-bold' style={{cursor: 'pointer'}} onClick={()=> deleteProductClick(product)}>Delete</td>
    </tr>
  });

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <div className={styles.code}>
          <label htmlFor='code' className='form-label'>Code</label>
          <input type='text' id='code' className='form-control' value={input.code} onChange={e => setInput({...input, code: e.target.value })}/>
        </div>
        <div className={styles.name}>
          <label htmlFor='name' className='form-label'>Product name</label>
          <input type='text' id='name' className='form-control' value={input.name} onChange={e => setInput({...input, name: e.target.value })}/>
        </div>
        <div>
          <label htmlFor='category' className='form-label'>Category</label>
          <select name='category' id='category' className='form-select' value={input.category} onChange={e => setInput({...input, category: e.target.value })}>
            <option value='All'>All</option>
            <option value='Food goods'>Food goods</option>
            <option value='Building materials'>Building materials</option>
            <option value='Chancery materials'>Chancery materials</option>
          </select>
        </div>
        <button className='btn btn-primary' onClick={search}>Search</button>
      </div>

      <table className='table'>
        <thead>
          <tr>
            <th scope='col' className='text-primary' style={{ width: '140px' }}>#Code</th>
            <th scope='col' className='text-primary' style={{ width: '120px' }}>Stock</th>
            <th scope='col' className='text-primary'style={{ width: '185px' }}>Category</th>
            <th scope='col' className='text-primary'>Name</th>
            <th scope='col'  style={{ width: '65px' }}>Actions</th>
            <th scope='col'  style={{ width: '65px' }}></th>
          </tr>
        </thead>
        <tbody>{ tableInfo }</tbody>
      </table>

      <Link href={'/product'} className='btn btn-success'>Add new product</Link>

      <div className='modal fade' id='deleteModal' tabIndex={-1} aria-labelledby='deleteModalLabel' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='deleteModalLabel'>Delete { toBeDeleted.code }</h1>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>Do you really want to delete: "<b>{ toBeDeleted.name }</b>" ?</div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal' onClick={()=> deleteProduct(false)}>Cancel</button>
              <button type='button' className='btn btn-danger' data-bs-dismiss='modal' onClick={()=> deleteProduct(true)}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
