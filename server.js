'use strict';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const captchaUrl = '/captcha.jpg';
const captchaMathUrl = '/captcha_math.jpg';
const captchaSessionId = 'captcha';
const captchaFieldName = 'captcha';

const captcha = require('svg-captcha-express').create({
    cookie: captchaSessionId
});

//load custom font (optional)
/* captcha.loadFont(path.join(__dirname, './fonts/Comismsh.ttf')); */

const app = express();
app.use(
    session({
        secret: 'your secret',
        resave: false,
        saveUninitialized: true
    })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get(captchaUrl, captcha.image());

app.get(captchaMathUrl, captcha.math());

app.get('/', (req, res) => {
    res.type('html');
    res.end(`
        <img src="${captchaUrl}"/>
        <form action="/login" method="post">
            <input type="text" name="${captchaFieldName}"/>
            <input type="submit"/>
        </form>
        <a href='/'>refresh</a>
    `);
});


app.get('/captcha', (req, res) => {
    console.log(captchaUrl)
    return res.send(`<img src="${captchaUrl}"/>`);
});

app.get('/math', (req, res) => {
    res.type('html');
    res.end(`
        <img src="${captchaMathUrl}"/>
        <form action="/login" method="post">
            <input type="text" name="${captchaFieldName}"/>
            <input type="submit"/>
        </form>
        <a href='/math'>refresh</a>
    `);
});

app.post('/login', (req, res) => {
    res.type('html');
    res.end(`
        <p>CAPTCHA VALID: ${captcha.check(req, req.body[captchaFieldName])}</p>
    `);
});


app.post('/check', (req, res) => {
    const { captchaFieldName } = req.body;
    if (!captchaFieldName) {
        return res.status(202).json({
            ok: false,
            err: 'Not captcha defined'
        });
    }
    return res.status(202).json({
        ok: true,
        success: captcha.check(req, captchaFieldName)
    });
});

app.listen(3000, function() {
    console.log('Listening on port 3000!');
});