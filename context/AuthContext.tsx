import { useRouter } from 'next/router';
import { createContext, useEffect, useReducer } from 'react';
import { User } from '../types/types';

const user = {} as User;
export const AuthContext = createContext({ user, appHasLoaded: false, dispatch: (action: any)=>{} });

export const authReducer = (state: any, action: any) => {
    if (action.type === 'login') {
        window.localStorage.setItem('user', JSON.stringify(action.payload));
        return { user: action.payload, appHasLoaded: true };
    } else if (action.type === 'logout') {
        window.localStorage.removeItem('user');
        return { user: {}, appHasLoaded: true };
    } else state;
}
//@ts-ignore
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: {}, appHasLoaded: false });
    const router = useRouter();

    useEffect(()=> {
        const cachedUser = window.localStorage.getItem('user');
        if (cachedUser) dispatch({ type: 'login', payload: JSON.parse(cachedUser) });
        if (cachedUser && router.pathname === '/') router.push('/storage');
    }, []);

    //@ts-ignore
    return <AuthContext.Provider value={{ ...state, dispatch }}>{ children }</AuthContext.Provider>
}