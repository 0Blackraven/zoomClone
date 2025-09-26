import {pool} from "../db/index.js"

const UsernameEmailAvailibility = async (usernameEmail:string, emailOrNot:boolean):Promise<boolean> =>{
    try{
        if(emailOrNot){
            return ((await  pool.query("SELECT username FROM users WHERE username = $1", [usernameEmail])).rowCount === 0);
        }else{
            return ((await  pool.query("SELECT email FROM users WHERE email = $1", [usernameEmail])).rowCount === 0);   
        }
    }catch(err:unknown){
        if(err instanceof Error){
            console.error(err.message);
            return false;
        }else{
            console.error(err);
            return false;
        }
    }
}

const registerUser = async (usernameEmail:string, emailOrNot:boolean, password:string) =>{
    try{
        if(!emailOrNot){
            const res = await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [usernameEmail, password]);
            return res.rows[0];
        }else{
            const res = await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [usernameEmail, password]);
            return res.rows[0];
        }
    }catch(err){
        if(err instanceof Error){
            console.error(err.message);
        }else{
            console.error(err);
        }
    }
}

const getUser = async (usernameEmail:string, emailOrNot:boolean) => {
    try{
        if(emailOrNot){
            const res = await pool.query("SELECT * FROM users WHERE email = $1",[usernameEmail]);
            return res.rows[0];
        }else{
            const res = await pool.query("SELECT * FROM users WHERE username = $1",[usernameEmail]);
            return res.rows[0];
        }
    }catch(err){
        if(err instanceof Error){
            console.error(err.message);
        }else{
            console.error(err);
        }
    }
}

const updateTokens = async (usernameEmail:string, emailOrNot:boolean, refreshToken?:string, accessToken?:string) =>{
    try{
        if(!emailOrNot){
            if(refreshToken === ""){
                await pool.query("UPDATE users SET accessToken = $1 WHERE username = $2", [accessToken, usernameEmail]);
            }else if(accessToken === ""){
                await pool.query("UPDATE users SET refreshToken = $1 WHERE username = $2", [refreshToken, usernameEmail]);
            }else{
                await pool.query("UPDATE users SET refreshToken = $1, accessToken = $2 WHERE username = $3", [refreshToken, accessToken, usernameEmail]);
            }
        }else{
            if(refreshToken === ""){
                await pool.query("UPDATE users SET accessToken = $1 WHERE email = $2", [accessToken, usernameEmail]);
            }else if(accessToken === ""){
                await pool.query("UPDATE users SET refreshToken = $1 WHERE email = $2", [refreshToken, usernameEmail]);
            }else{
                await pool.query("UPDATE users SET refreshToken = $1, accessToken = $2 WHERE email = $3", [refreshToken, accessToken, usernameEmail]);
            }
        }
    }catch(err){
        if(err instanceof Error){
            console.error(err.message);
        }else{
            console.error(err);
        }
    }
}

const changePassword = async (usernameEmail:string, emailOrNot:boolean, password:string) =>{
    try{
        if(emailOrNot){
            await pool.query("UPDATE users SET passwords = $1 WHERE email = $2", [password, usernameEmail]);
        }else{
            await pool.query("UPDATE users SET passwords = $1 WHERE username = $2", [password, usernameEmail]);
        }
    }catch(err){
        if(err instanceof Error){
            console.error(err.message);
        }else{
            console.error(err);
        }
    }
}

export {getUser, registerUser, UsernameEmailAvailibility, updateTokens, changePassword};