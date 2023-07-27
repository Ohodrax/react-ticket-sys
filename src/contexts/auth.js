import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // checa session
    useEffect(() => {
        async function loadUser(){
            const storageUser = localStorage.getItem("@ticketsPRO");

            if (storageUser) {
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
            setLoading(false);
        }

        loadUser();
    }, []);

    // logar usuario
    async function signIn(email, password){
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef)

            let data = {
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);

            toast.success("Seja bem vindo(a) ao sistema!");

            navigate("/dashboard");

        })
        .catch((error) => {
            switch (error.code) {
                case "auth/wrong-password":
                    toast.error("Senha incorreta.");
                break;

                case "auth/invalid-email":
                    toast.error("E-mail inválido.");
                break;

                case "auth/user-not-found":
                    toast.error("E-mail não encontrado.");
                break;
            
                default:
                    toast.error("Ops, ocorreu um erro ao cadastrar suas informações.");
                    console.log("Err.: " + error.code);
                break;
            }
            setLoadingAuth(false);
        })
    }

    // cadastrar usuario
    async function signUp(email, password, name){
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            await setDoc(doc(db, "users", uid), {
                nome: name,
                avatarUrl: null
            })
            .then(() => {
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                }

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);

                toast.success("Seja bem vindo ao sistema!");

                navigate("/dashboard");
            })
            .catch((error) => {
                switch (error.code) {
                    // case value:
                        
                    // break;
                
                    default:
                        toast.error("Ops, ocorreu um erro ao cadastrar suas informações.");
                        console.log("Err.: " + error.code);
                    break;
                }
                setLoadingAuth(false);
            })
        })
        .catch((error) => {
            switch (error.code) {
                case "auth/invalid-email":
                    toast.error("E-mail inválido.");
                break;

                case "auth/weak-password":
                    toast.error("Senha muito fraca.");
                break;

                case "auth/email-already-in-use":
                    toast.error("Esse e-mail já esta em uso.");
                break;
            
                default:
                    toast.error("Ops, ocorreu um erro.");
                    console.log("Err.: " + error.code);
                break;
            }
            setLoadingAuth(false);
        })
    }

    // guardar info do usuario no localStorage
    function storageUser(data){
        localStorage.setItem("@ticketsPRO", JSON.stringify(data));
    }

    // deslogar usuario
    async function logout(){
        await signOut(auth);
        localStorage.removeItem('@ticketsPRO');
        setUser(null);

        toast.success("Deslogado!");
    }

    return(
        <AuthContext.Provider value={{
            signed: !!user, // false porque a const user esta nulo, ou seja, não tem user logado, caso tenha será true (Basicamente o ISSET do PHP)
            user,
            signIn,
            signUp,
            logout,
            loadingAuth,
            loading,
            storageUser,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;