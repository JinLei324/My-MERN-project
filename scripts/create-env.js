const fs = require('fs')

fs.writeFileSync('./.env',  `REACT_APP_BACKEND_URL=${process.env.REACT_APP_BACKEND_URL}\nREACT_APP_SOCKET_URL=${process.env.REACT_APP_SOCKET_URL}\n`)