import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Fetch from '../utils/fetch';

export default function Home() {
  const [accErr, setAccErr] = useState('');
  const router = useRouter();
  const authContext = useContext(AuthContext);

  async function login(e: FormEvent) {
    e.preventDefault(); // @ts-ignore 
    const username = e.target[0].value; // @ts-ignore 
    const password = e.target[1].value; 

    const acc = await Fetch('api/login', { username, password }).catch(err => setAccErr(err.message));
    if (!acc) return;
    authContext.dispatch({ type: 'login', payload: acc });
    router.push('/storage');
  }

  return (
    <div className='d-flex justify-content-center align-items-center w-100 min-vh-100'>
       <form onSubmit={ login } style={{ width: '300px' }}>
          <div className="mb-3">
              <label htmlFor="username" className="col-form-label">Username:</label>
              <input type="text" className="form-control" id="username" required/>
          </div>
          <div className="mb-3">
              <label htmlFor="password" className="col-form-label">Password:</label>
              <input type="password" className="form-control" id="password" required/>
          </div>
          <button className='btn btn-primary mb-1' style={{ width: '100%' }}>Login</button>
          { accErr && <div className="text-danger mb-1">{ accErr }</div> }
          <div>
            <Link href='/register'>No account? Register</Link>
          </div>
      </form>
    </div>
  )
}
