const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./route/route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb+srv://mohdshariqfzs:8n8SeuCAOTvQwr0G@cluster0.8jpw4p9.mongodb.net/BookInventory?retryWrites=true&w=majority', {
    useNewUrlParser: true
})
.then(() => console.log('Mongodb is Connected'))
.catch( error => console.log(error))

app.use('/', route);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server Starting on PORT ' + (process.env.PORT || 3000))
})