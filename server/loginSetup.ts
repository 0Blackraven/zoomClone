import jwt from "JsonWebToken"
import dotenv from "dotenv"
import { createHash } from "crypto";
import type { Request,Response } from "express";
import {getUser, registerUser, UsernameEmailAvailibility, updateTokens} from "./queries/userQueries.js"

dotenv.config();
const secret:string = process.env.SECRET || "secret" 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const refreshTokenGenerator = (password:string):string => {
    return jwt.sign(
        { password },
        process.env.REFRESHTOKENSECRET || "default",
        { expiresIn: "7d"}
    )
}

const accessTokenGenerator = (password:string):string =>{
    return jwt.sign(
        { password },
        process.env.ACCESSTOKENSECRET || "default",
        { expiresIn: "1d"}
    )
}

const hashGenerator = (password:string):string =>{
    return createHash('sha256').update(password + secret).digest("hex");
}

const emailOrNot = (usernameEmail:string):boolean =>{
    return emailRegex.test(usernameEmail);
}

const loginSetup = async (req:Request, res:Response) =>{
    const {usernameEmail, password, mode}:{usernameEmail:string, password:string, mode:"signIn"|"signUp"} = req.body as {usernameEmail:string, password:string, mode:"signIn"|"signUp"};

    if(!usernameEmail || !password || !mode){
        return res.status(400).json("All fields are to be filled");
    }

    if(mode === "signIn"){
        getUser(usernameEmail,emailOrNot(usernameEmail)).then((user)=>{
            if(!user){
                return res.status(401).json("User not found");
            }
            if( hashGenerator(password) !== user.password){
                return res.status(402).json("Wrong Password");
            }
            const accessToken = accessTokenGenerator(password)
            res.cookie("accessToken", accessToken,{
                httpOnly:true,
                secure:true
            });
            const refreshToken = refreshTokenGenerator(password)
            res.cookie("refreshToken", refreshToken,{
                httpOnly:true,
                secure:true
            });
            updateTokens(usernameEmail, emailOrNot(usernameEmail), refreshToken, accessToken)
            return res.status(200).json("Login Successfull");

        }).catch((err)=>{
            if(err instanceof Error){
                console.error(err.message);
                return res.status(401).json(err.message);
            }else{
                console.error(err);
                return res.status(401).json(err);
            }
        })
    }else{
        try{
            const UsernameEmailAvailable:boolean = await UsernameEmailAvailibility(usernameEmail, emailOrNot(usernameEmail));
            if(!UsernameEmailAvailable){
                return res.status(401).json("Username/Email is already taken");
            }
            registerUser(usernameEmail,emailOrNot(usernameEmail),hashGenerator(password))
            const accessToken = accessTokenGenerator(password)
            res.cookie("accessToken", accessToken,{
                httpOnly:true,
                secure:true
            });
            const refreshToken = refreshTokenGenerator(password)
            res.cookie("refreshToken", refreshToken,{
                httpOnly:true,
                secure:true
            });
            updateTokens(usernameEmail, emailOrNot(usernameEmail), refreshToken, accessToken)
            return res.status(200).json("Registration Successfull");
        }catch(err){
            if(err instanceof Error){
                console.error(err.message);
                return res.status(401).json(err.message);
            }else{
                console.error(err);
                return res.status(401).json(err);
            }
        }
    }
}
