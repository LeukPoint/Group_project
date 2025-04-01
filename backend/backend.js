require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');

const app = express();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const sessionStore = new MySQLStore({
    ...dbConfig,
    checkExpirationInterval:900000,
    expiration: 86400000
});

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000,
        httpOnly: true,
        secure:process.env.NODE_ENV === 'production'
    }
}));


const pool = mysql.createPool(dbConfig);
 const requireAuth = (req,res,next) => {
    if(!req.session.user){
        return res.status(401).json({error:'Need to Login'});
    }
    next();
 };

 app.post('/api/register', async(req,res)=>{
    try{
        const{ username, password, email} = req.body;
        if(!username||!password||!email){
            return res.status(400).json({error:'All fields are required'});
        }
        const [existing] = await pool.query('SELECT id FROM users WHERE username =?',[username]);
        if(existing.length>0){
            return res.status(409).json({error: 'The username has already been taken'});
        }
        
        const hashedPassword = await bcrypt.hash(password,10);
        const [result] = await pool.query('INSERT INTO users (username,password,email) VALUES (?, ?, ?)',[username,hashedPassword,email]);
        res.status(201).json({
            message: 'Register successfully',
            user: {id: result.insertId, username, email}
        }); 
    }
    catch(err){
        console.error('Registration error:', err);
        res.status(500).json({error:'Server error'});
    }
 });

 app.post('/api/login',async (req, res)=>{
    try{
        const {username,password} = req.body;
        if(!username||!password){
            return res.status(400).json({error:'Need username and password'});
        }
        const [users] = await pool.query('SELECT * FROM users WHERE username =?',[username]);
        if(users.length === 0){
            return res.status(401).json({error:'Wrong username or password'});
        }
        const isValid = await bcrypt.compare(password,users[0].password);
        if(!isValid){
            return res.status(401).json({error:'Wrong username or password'});
        }
        const user = {
            id: users[0].id,
            username: users[0].username,
            email: users[0].email
        };
        req.session.user = user;
        res.json({
            message:'Login successfully',
            user
        });
    }
    catch(err){
        console.error('Login error:',err);
        res.status(500).json({error: 'Server error'})
    }
 });

 app.get('/api/me', requireAuth,(req,res)=>{
    res.json(req.session.user);
 });

 app.post('/api/logout',requireAuth,(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            console.error('Failed to logout:',err);
            return res.status(500).json({error:'Failed to logout'});
        }
        res.clearCookie('connect.sid');
        res.json({message:'Logout successfully'});
    });
 });

 app.get('/api/users',requireAuth,async(req,res)=>{
    try{
        const{search}=req.query;
        let query = 'SELECT id,username,email FROM users';
        const params = [];
        if(search){
            query+='WHERE username LIKE ? OR email LIKE?';
            params.push(`%${search}%`,`%${search}%`);
        }
        const [users] = await pool.query(query,params);
        res.json(users);
    }
    catch(err){
        console.error('Error in obtaining user list:',err);
        res.status(500).json({error:'Server error'});
    }
 });

 app.put('/api/users/:id', requireAuth,async(req,res)=>{
    try{
        const userId = parseInt(req.params.id);
        const currentUser = req.session.user;

        if((currentUser.id!==userId)&&(currentUser.username!=='admin')){
            return res.status(403).json({error:'No permission}'});
        }
        const {email, newPassword} = req.body;
        const updates =[];
        const params = [];
        if(email){
            updates.push('email =?');
            params.push(email);
        }
        if(newPassword){
            const hashedNewPassword = await bcrypt.hash(newPassword,10);
            updates.push('password=?');
            params.push(hashedNewPassword);
        }
        if(updates.length===0){
            return res.status(400).json({error:'No updated content'});
        }
        params.push(userId);
        await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id =?`,params);

        if(email && currentUser.id === userId){
            req.session.user.email = email;
        }
        const [updatedUser] = await pool.query('SELECT id, username, email FROM users WHERE id =?',userId)
        if(currentUser.id === userId){
            req.session.user = updatedUser[0]
        }
        res.json({
            message: 'Update Successfully',
            user: updatedUser[0]
        })
    }
    catch(err){
        console.error("Update error:",err);
        res.status(500).json({error:'Server error'});
    }
 });

 app.delete('/api/users/:id',requireAuth,async(req,res)=>{
    try{
        const userId = parseInt(req.params.id);
        const currentUser = req.session.user;
        if((currentUser.id!==userId)&&(currentUser.username!=='admin')){
            return res.status(403).json({error:'No permission}'});
        }
        await pool.query('DELETE FROM users WHERE id = ?',[userId]);
        if(currentUser.id === userId){
            req.session.destroy();
            res.clearCookie('connect.sid');
        }
        res.json({message:'Delete successfully'});
    }
    catch(err){
        console.error('Error in deleting user:',err);
        res.status(500).json({error:'Server error'});
    }
 });

 const PORT = process.env.PORT || 3000;
 app.listen(PORT, ()=>{
    console.log(`Server run on port ${PORT}`);
 });