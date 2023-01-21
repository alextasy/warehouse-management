import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Fetch from '../utils/fetch';

export default function Register() {
  const [accErr, setAccErr] = useState('');
  const router = useRouter();
  const authContext = useContext(AuthContext);

  async function register(e: FormEvent) {
    e.preventDefault(); // @ts-ignore 
    const username = e.target[0].value; // @ts-ignore 
    const password = e.target[1].value; // @ts-ignore
    const email = e.target[2].value; // @ts-ignore
    const phone = e.target[3].value; 
    
    const acc = await Fetch('api/register', { username, password, email, phone }).catch(err => setAccErr(err.message));
    if (!acc) return;  
    authContext.dispatch({ type: 'login', payload: acc });
    router.push('/storage');
  }

  return (
    <div className='d-flex justify-content-center align-items-center w-100 min-vh-100'>
       <form onSubmit={ register } style={{ width: '300px' }}>
          <div className="mb-3">
              <label htmlFor="username" className="col-form-label">Username:</label>
              <input type="text" className="form-control" id="username" required minLength={5} maxLength={15} pattern='^[a-zA-Z_]*$'/>
          </div>
          <div className="mb-3">
              <label htmlFor="password" className="col-form-label">Password:</label>
              <input type="password" className="form-control" id="password" required minLength={6} maxLength={20} pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@\-_~|]).*$'/>
          </div>
          <div className="mb-3">
              <label htmlFor="email" className="col-form-label">Email:</label>
              <input type="email" className="form-control" id="email" required/>
          </div>
          <div className="mb-3">
              <label htmlFor="phone" className="col-form-label">Phone number:</label>
              <input type="text" className="form-control" id="phone" pattern='^[\d\- ]*$'/>
          </div>
          <button className='btn btn-primary mb-1' style={{ width: '100%' }}>Register</button>
          { accErr && <div className="text-danger mb-1">{ accErr }</div> }
          <div>
            <Link href='/'>Already have an account? Log in</Link>
          </div>
      </form>
    </div>
  )
}
