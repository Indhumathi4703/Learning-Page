const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const http = require('http')
const cors = require('cors')
const user = require('./router/routes')
const keyfile = require('./config/keyfile')
const app = express()

const port = process.env.PORT
const dbUrl = keyfile.dbUrl
app.use(cors())

const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(dbUrl, option)
    .then(() => {
        console.log('db connected successfully');

    }).catch((err) => {
        console.log('Error connecting to database:', err);
        process.exit(1)
    });
app.use(morgan('combined'))
app.use(express.json())
app.use('/user', user)


const httpsServer = http.createServer(app);
const server = httpsServer.listen(process.env.PORT, function () {
    console.log(`HTTPS server is running on http://localhost:${port}`);

});
module.exports = server;