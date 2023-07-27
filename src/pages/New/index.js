import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

import { db } from '../../services/firebaseConnection';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc } from 'firebase/firestore';

import { toast } from 'react-toastify';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiPlusCircle } from 'react-icons/fi';
import "./new.css";

const listRef = collection(db, 'customers');

export default function New(){

    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [customers, setCustomers] = useState([]);
    const [loadCustomer, setLoadCustomer] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);
    
    const [complemento, setComplemento] = useState('');
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [idCustomer, setIdCustomer] = useState(false);
    
    useEffect(() => {
        async function loadCustomers(){
            const querySnapshot = await getDocs(listRef)
            .then((snapshot) => {
                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if (snapshot.docs.size === 0) {
                    console.log("Nenhuma empresa encontrada.");
                    setCustomers([ {id: 1, nomeFantasia: "FREELA"} ]);
                    return;
                }

                setCustomers(lista);
                setLoadCustomer(false);

                if (id) {
                    loadId(lista);
                }
            })
            .catch((error) => {
                console.log("ERR.:", error);
                setLoadCustomer(false);
                setCustomers([ {id: 1, nomeFantasia: "FREELA"} ]);
            });
        }

        loadCustomers();
    }, []);

    async function loadId(lista){
        const docRef = doc(db, "chamados", id);

        await getDoc(docRef)
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);

            setCustomerSelected(index);

            setIdCustomer(true);
        })
        .catch((error) => {
            console.log(":NEW: " + error);
            toast.error("Este chamado não existe.");
            setIdCustomer(false);

            navigate('/dashboard', {replace: true});
        })

    }

    function handleOptionChange(e){
        setStatus(e.target.value);
    }

    function handleChangeCustomer(e){
        setCustomerSelected(e.target.value);
    }

    async function handleRegister(e){
        e.preventDefault();

        if (idCustomer) {
            handleUpdate();
            return;
        }

        await addDoc(collection(db, "chamados"), {
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid
        })
        .then(() => {
            toast.success("Novo chamado registrado!");
            
            navigate("/dashboard", { replace: true });
        })
        .catch((error) => {
            console.log("ERR.: " + error.code);
            toast.error("Ops ocorreu um erro ao registrar");
        })
    }

    async function handleUpdate(){
        const docRef = doc(db, "chamados", id);

        await updateDoc(docRef, {
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid
        })
        .then(() => {
            toast.success("Chamado atualizado com sucesso!");

            navigate("/dashboard", { replace: true });
        })
        .catch((error) => {
            console.log("ERR.: " + error);
            toast.error("Não foi possível atualizar chamado.");
        })
    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name={idCustomer ? "Editar chamado" : "Novo chamado"}>
                    <FiPlusCircle size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type='text' disabled value="Carregando..."/>
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {customers.map((item, index) => {
                                            return(
                                                <option key={index} value={index}>{item.nomeFantasia}</option>
                                            )
                                        })}
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={(e) => setAssunto(e.target.value)}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Técnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='status'>
                            <input type='radio' name='radio' value="Aberto" onChange={handleOptionChange} checked={status === 'Aberto'}/>
                            <span>Em andamento</span>

                            <input type='radio' name='radio' value="Progresso" onChange={handleOptionChange} checked={status === 'Progresso'}/>
                            <span>Progresso</span>

                            <input type='radio' name='radio' value="Atendido" onChange={handleOptionChange} checked={status === 'Atendido'}/>
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea type="text" placeholder='Descreva seu problema' value={complemento} onChange={(e) => setComplemento(e.target.value)}/>

                        <button type='submit'>Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}