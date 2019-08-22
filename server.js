const express = require('express')
const path = require('path')
const { Pool } = require('pg')
const bodyParser = require('body-parser')

const pool = new Pool({
	user: 'thewellhopeerr',
  	host: '/var/run/postgresql',
  	database: 'thewellhopeerr',
  	password: null,
  	port: 5432,
})

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', function(req,res) {
	res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/auth', function(req,resp) {
	var user = req.body.username
	var pass = req.body.password		
	if(user && pass){
		pool.query(`SELECT * FROM login WHERE username=$1 AND password=$2`,[ user, pass ],(err,res) => {
			if(err)
				console.log(err)
			else
				if(res.rows.length > 0){
					resp.redirect('/home')
				}
				else{
					resp.send('Wrong Creds')
				}
		})
	}
	else
		resp.send('Enter creds...')
})

app.get('/home',function(req,res) {
	console.log("Logged In")
	res.sendFile(path.join(__dirname + '/loggedIn.html'))
})
	
app.listen(3000, () => {
	console.log('Listening on Port 3000...')
})