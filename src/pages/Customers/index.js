import { db } from "../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiUser } from 'react-icons/fi';

import "./customers.css";
import { useState } from 'react';

import { toast } from 'react-toastify';

export default function Customers(){
    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleRegister(e){
        e.preventDefault();

        if (nomeEmpresa !== "" && cnpj !== "" && endereco !== "") {
            await addDoc(collection(db, "customers"), {
                nomeFantasia: nomeEmpresa,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(() => {
                setNomeEmpresa('');
                setCnpj('');
                setEndereco('');

                toast.success("Cliente cadastrado com sucesso!");
            })
            .catch((error) => {
                toast.error("Erro ao cadastrar cliente.");
                console.log("ERR.:" + error.code);
            })
        } else {
            toast.warn("Preencha todos os campos");
        }
    }

    return(
        <div>
            <Header/>
            
            <div className='content'>
                <Title name="Clientes">
                    <FiUser size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Nome fantasia</label>
                        <input type="text" placeholder='Nome da empresa' onChange={(e) => setNomeEmpresa(e.target.value)} value={nomeEmpresa}/>

                        <label>CNPJ</label>
                        <input type="text" placeholder='Digite o CNPJ' onChange={(e) => setCnpj(e.target.value)} value={cnpj}/>

                        <label>Endereço</label>
                        <input type="text" placeholder='Endereço da empresa' onChange={(e) => setEndereco(e.target.value)} value={endereco}/>

                        <button type='submit'>Salvar</button>
                    </form>
                </div>
            </div>

        </div>
    )
}