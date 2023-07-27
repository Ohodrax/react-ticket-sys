import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

import { toast } from 'react-toastify';

import './signin.css';
import logo from '../../assets/logo.png';


export default function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn, loadingAuth } = useContext(AuthContext);

    async function handleSignIn(e){
        e.preventDefault();

        if (email !== "" && password !== "") {
            await signIn(email, password);
        } else {
            toast.warn("Preencha todos os campos.");
        }
    }

    return(
        <div className="container-center">
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt="Logo do sistema de chamados"/>
                </div>

                <form onSubmit={handleSignIn}>
                    <h1>Entrar</h1>
                    <input type='text' placeholder='email@email.com' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type='password' placeholder='*******' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    
                    {loadingAuth ? (
                        <button type="submit" disabled>Carregando...</button>
                    ) : (
                        <button type="submit">Acessar</button>
                    )}
                </form>

                <Link to="/register">Criar uma conta</Link>
            </div>
        </div>
    )
}