import { useParams } from 'react-router-dom';

export default function Board() {
    const { id } = useParams();

    // Use the id parameter as needed
    return (
        <div className='board mx-40 border'>
            <div className='todo'></div>
            <div className='inprogress'></div>
            <div className='done'></div>
        </div>
    )
};

