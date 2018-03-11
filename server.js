const express = require('express');
const bodyParser = require('body-parser');

const app = express();


app.use(express.static('client'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('*', (req, res) => res.redirect('/'));



app.listen(process.env.PORT || 3000);