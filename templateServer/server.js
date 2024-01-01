import { app,server,express} from "./socket.js";
import router from "./routes/route.js";
import { dirname,join } from 'node:path'
import { fileURLToPath } from "node:url";



const _dirname = dirname(fileURLToPath(import.meta.url))

app.set('view engine', 'ejs')
app.set('views',join(_dirname,'views'))

app.use(express.static('templateServer/public'))
app.use('/',router)



server.listen(3000)