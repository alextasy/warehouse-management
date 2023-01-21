import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import style from '../styles/header.module.css';

export default function Header() {
    const router = useRouter();
    const authContext = useContext(AuthContext);

    function logOut() { 
        authContext.dispatch({ type: 'logout' });
        router.push('/');
    }

  return (
    <div className={style.header}>
        <b>Ware<span>HOUSE</span></b>
        {   authContext.user.email ? 
            <div className='d-flex'>
                <div style={{ marginRight: '20px' }}>
                    <div className={style.info}>Logged in as:</div>
                    <div className={style.email}>{ authContext.user.email }</div>
                </div>
                <button className='btn btn-danger' onClick={ logOut }>Log out</button>
            </div>
            : null
        }
    </div>
  )
}
