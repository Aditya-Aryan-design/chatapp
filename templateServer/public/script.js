const side = document.getElementById('side')
const btn = document.getElementById('btn')
const inp = document.getElementById('inp')
const header = document.getElementById('header')
const container = document.getElementById('container')
let msgs = [];



let targId = false;
let active;



const handleClick = (e)=>{
    targId=e
    
    btn.removeAttribute('disabled')


    active = document.getElementById(e);

    active.setAttribute('class','active user')

    let notification = document.getElementById(`${e}span`)
    if(notification) notification.outerHTML = ''

    for(let i=0; i<side.children.length; i++){
        if(side.children[i].id !== targId) side.children[i].setAttribute('class','user')

    }
    header.innerText = active.innerText;

    container.innerHTML = '';
    for(let i=0; i<msgs[targId].length; i++){
        const newMsg = document.createElement('p');

        if(msgs[targId][i][0] === 'You'){

            newMsg.setAttribute('class','you')

        } else {
            newMsg.setAttribute('class','other')
        }
        newMsg.innerText = msgs[targId][i][1]
        container.appendChild(newMsg)
    }

};
class newuser{
    constructor(){
        this.id = undefined;
        this.connect()
    }
    
    connect(){
        this.user = prompt('Enter your name')
        
        if(this.user){
            const socket = io();
            this.socketevents(socket)
            this.id = socket.id;
            socket.emit('new-user',this.user)

            socket.on('disconnect',()=>{
                console.log('disconnected from the server');
            })
        } else {
            this.connect()
        }
    }
    socketevents(socket){
        socket.on('greeting',([id, newUsr])=>{
            let Usr = document.createElement('div');
            Usr.setAttribute('id',id);
            Usr.setAttribute('onclick',`handleClick('${id}')`)
            Usr.setAttribute('class','user');
            if(newUsr.length > 10){
                Usr.innerHTML = `<span>${newUsr.slice(0, 8)}..</span>`;
                
            } else {
                Usr.innerHTML = `<span>${newUsr}</span>`;
                
            }
            
            side.appendChild(Usr)
            
            msgs[id] = [];
        })
        socket.on('userDisconnect',(id)=>{
            let discUsr = document.getElementById(id);
            if(discUsr) discUsr.outerHTML = '';
            msgs[id] = null;
        })
        socket.on('allUsr',(arr)=>{
            for(let i=0; i<arr.length; i++){

                let Usr = document.createElement('div');
                Usr.setAttribute('id',arr[i].id);
                Usr.setAttribute('onclick',`handleClick('${arr[i].id}')`)
                Usr.setAttribute('class','user');
                
                if(arr[i].name.length > 10){
                    Usr.innerHTML = `<span>${arr[i].name.slice(0, 8)}..</span>`;
                    
                } else {
                    Usr.innerHTML = `<span>${arr[i].name}</span>`;
                    
                }
                side.appendChild(Usr);

                msgs[arr[i].id] = [];

            }
        })
        socket.on('yr-msg',(data)=>{
            msgs[data[0]].push(data);
            
            if(targId === data[0]){
                const newMsg = document.createElement('p');

                newMsg.innerText = data[1];

                newMsg.setAttribute('class','other')

                container.appendChild(newMsg)

            } else {
                const sender = document.getElementById(data[0])

                let notification = document.getElementById(`${data[0]}span`)
                if(notification){
                    notification.innerText = parseInt(notification.innerText)+1
                    
                } else {
                    const notification = document.createElement('span')
                    notification.innerText = 1;
                    notification.setAttribute('class','notification')
                    notification.setAttribute('id',`${data[0]}span`)
                    sender.appendChild(notification)

                    Notification.requestPermission().then(prem => {
                        if(prem === "granted"){
                            new Notification(sender.firstElementChild.innerText, {
                                body: data[1]
                            })
                        }
                    })
                }
            }

        })
        btn.addEventListener('click',()=>{

            if(!inp.value) return
            if(targId){

                socket.emit('prvt-msg',([targId, inp.value]))
                msgs[targId].push(['You',inp.value])

                const newMsg = document.createElement('p');
                newMsg.innerText = inp.value;
                newMsg.setAttribute('class','you')
                container.appendChild(newMsg)

            }
            inp.value = ''

        })
    }
}

const newUser = new newuser()