import express from "express";
const app = express();
import { Server } from "socket.io";
import {createServer} from 'node:http'


const server = createServer(app)
const io = new Server(server)

let room = [];

io.on('connection',(socket)=>{
    const id = socket.id;
    socket.on('new-user',(newUsr)=>{
        socket.emit('allUsr',(room))
        socket.broadcast.emit('greeting',([id, newUsr]))
        room.push({ id, name:newUsr })
    })
    socket.on('prvt-msg',async([targId, msg])=>{
        try {
            const Usrs = await io.fetchSockets();

            for(let i=0; i<Usrs.length; i++){
                if(Usrs[i].id === targId){

                    return Usrs[i].emit('yr-msg',[id, msg])
                }
            }
        } catch (e) {
            io.emit('err',e)
            console.log(e);
        }
    })
    socket.on('disconnect',()=>{
        room = room.filter((e)=>e.id !== id)
        io.emit('userDisconnect',(id))
    })
})


export {app, server, express}