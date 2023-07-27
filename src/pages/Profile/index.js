import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';
import { FiSettings, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import Title from '../../components/Title';

import "./profile.css";
import avatar from "../../assets/avatar.png";

import { db, storage } from '../../services/firebaseConnection';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default function Profile(){
    const { user, logout, setUser, storageUser } = useContext(AuthContext);

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);

    const [saving, setSaving] = useState(false);

    function handleFile(e){
        if (e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === "image/jpeg" || image.type === "image/png") {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            } else {
                toast.warn("Apenas imagens do tipo PNG ou JPEG são suportados.");
            }
        }
    }

    async function handleSubmit(e){
        e.preventDefault();

        setSaving(true);

        //atualziar apenas o nome
        if (imageAvatar === null && nome !== "") {
            const docRef = doc(db, "users", user.uid);

            await updateDoc(docRef, {
                nome: nome
            })
            .then(() => {
                let data = {
                    ...user,
                    nome: nome
                }

                setUser(data);
                storageUser(data);

                toast.success("Nome atualizado com sucesso!");
                setSaving(false);
            })
            .catch((error) => {
                toast.error("Ops, aconteceu um erro.");
                console.log("ERR.: " + error)
                setSaving(false);
            })
        } else if(nome !== "" && imageAvatar !== null) {
        // atualizar nome e foto
            toast.success("Nome atualizado com sucesso!");

            handleUpload();
        } else {
            toast.warn("Preencha com algum nome ou imagem.");
            setSaving(false);
        }
    }

    async function handleUpload(){
        const currentUid = user.uid;

        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);

        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                let urlFoto = downloadURL;

                const docRef = doc(db, "users", user.uid);

                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    nome: nome
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlFoto
                    }
    
                    setUser(data);
                    storageUser(data);
    
                    toast.success("Imagem atualizada com sucesso!");
                    setSaving(false);


                })
                .catch((error) => {
                    toast.error("Ops, aconteceu um erro.");
                    console.log("ERR.: " + error)
                    setSaving(false);
                })
            })
        })
        .catch((error) => {
            toast.error("Não foi possível atualizar sua imagem.");
            console.log("ERR.:" + error.code);
            setSaving(false);
        })
    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name="Minha conta">
                    <FiSettings size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleSubmit}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color="#FFF" size={25} />
                            </span>

                            <input type='file' accept='image/*' onChange={handleFile}/>
                            {avatarUrl === null ? (
                                <img src={avatar} alt="Foto do perfil" width={250} height={250} />
                            ) : (
                                <img src={avatarUrl} alt="Foto do perfil" width={250} height={250} />
                            )}
                        </label>

                        <label>Nome:</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>

                        <label>E-mail:</label>
                        <input type="text" placeholder='teste@teste.com' disabled value={email}/>

                        {saving ? (
                            <button disabled>Salvando...</button>
                        ) : (
                            <button type='submit'>Salvar</button>
                        )}
                    </form>
                </div>

                <div className='container'>
                    <button className='logout-btn' onClick={() => logout()}>Sair</button>
                </div>
            </div>

        </div>
    )
}