import './modal.css';
import { FiX } from 'react-icons/fi';

export default function Modal({details, close}){
    return(
        <div className="modal">
            <div className='container'>
                <button className='close' onClick={close}>
                    <FiX size={25} color='#FFF'/>
                    Voltar
                </button>

                <main>
                    <h2>Detalhes do Chamado</h2>

                    <div className='row'>
                        <span>
                            Cliente: <i>{details.cliente}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Assunto: <i>{details.assunto}</i>
                        </span>
                        <span>
                            Cadastrado em: <i>{details.createdFormat}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Status: <i className='status-badge' style={{ color: '#FFF', backgroundColor: details.status === 'Aberto' ? '#5cb85c' : '#999' }}>{details.status}</i>
                        </span>
                    </div>

                    {details.complemento !== '' && (
                        <>
                            <h3>Complemento</h3>
                            <p>
                                {details.complemento}
                            </p>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}