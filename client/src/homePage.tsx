import {socket} from './socket';
import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';


export const HomePage =() =>{

    const [roomId, setRoomId] = useState<string>('');
    const navigate = useNavigate();

    const handleJoin = () =>{
        const id = roomId;
        socket.emit('joinRoom', id);
        console.log("joining room: ", id);
        navigate(`/${id}`);
    }

    const handleCreate = () =>{
        socket.emit('createRoom');
        console.log("creating room");
        socket.on('roomCreated', (id:string)=>{
            setRoomId(id);
            navigate(`/${id}`);
        })
    }
    
    return(
        <div>
            <Input placeholder='Enter Room ID' onChange={(e)=>setRoomId(e.target.value)}/>
            <Button onClick={handleJoin}>Join Room</Button>
            <Button onClick={handleCreate}>Create Room</Button>
        </div>
    )
}