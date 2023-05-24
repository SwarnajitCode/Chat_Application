const express = require('express');
const path = require('path')
const app = express();
const bcrypt = require('bcrypt')
const {sign} = require('jsonwebtoken');
const {sequelize, userchat,message,usertoken} = require('../models')
const { Op } = require("sequelize");

module.exports = {


    viewChat: async(req, res) => {
        console.log('url',req.query.name)
        res.append('rom',req.query.name)
        res.sendFile(path.resolve(__dirname+'/../public/index.html'))
    }, 


    registration: async (req,res) =>{
        res.sendFile(path.resolve(__dirname+'/../public/register.html'))
    },


    registrationDb: async (req,res) => {
        const{fname,lname,email,password } = req.body;
        console.log('content',req.body)
        try{
            const hash =await bcrypt.hash(password,10)
            const user = await userchat.create({fname:req.body.fname,lname,email,password:hash,status:'Offline'})
            res.sendFile(path.resolve(__dirname+'/../public/login.html'))
            
        }catch(err){
            console.log(err)
            return res.status(500).json({error:"semthing went wrong"})
        }
    },


    loginView: async(req, res) => {
        res.sendFile(path.resolve(__dirname+'/../public/login.html'))
    },



    login: async(req,res) => {
        const{email,password } = req.body;
        
        try{
            const user = await userchat.findOne({where:{email}})
            const result = bcrypt.compareSync(req.body.password,user.password)
            const status = await userchat.update({status:'Online'},{where:{id:user.id}})
            if(result){
              const jsontoken = sign({result: user},"qwe1234",{expiresIn:'30m'})
              const refreshToken = sign({result: user},"refresh",{expiresIn:'30d'})
              const tokken = await usertoken.create({userId:user.id, token:jsontoken})
              req.session.userId = user.id
              req.session.token = jsontoken
              req.session.save(function(err){
                // session saved
              })   
              return res.status(200).json({jsontoken,refreshToken})
            }else{
                console.log('login error')
                res.status(500)
            }

        }catch(err){
            console.log(err)
            return res.status(500).json({error:"semthing went wrong"})
        }
    },



    viewRoom : async(req,res)=>{
        try{
            //const mulRoom = await userroom.findAll({where:{userId:req.session.userId}})
            const actualRooms = await userchat.findAll()
            //console.log('actroom',actualRooms.map(o=>o.roomname))
            vlu = actualRooms.map(function (item){ return [item.id,item.fname,item.status]});
            //res.send(actualRooms.map(o=>o.id),actualRooms.map(o=>o.fname))
            res.status(200).send(vlu)


        }catch(err){
            console.log(err)
            return res.status(500).json({error:"semthing went wrong"})

        }
    
    },



    createRoom : async(req,res) =>{ 
        console.log('its body',req.body)
        console.log('testing', req.session)
        //console.log('id =',req.session.userId)
        const roomname = req.body.room;
        try{
            // inserting into room table
           // const roominfo = await room.create({roomname})
             
            // inserting into userroom table
            //const userroominfo = await userroom.create({roomId:roominfo.id,userId:req.session.userId})

           // res.send('done')

        }catch(err){
            console.log(err)
            return res.status(500).json({error:"something went wrong"})
        }

    },

    message: async(req,res) =>{
        console.log('session',req.session)
         try{
            const msge = await message.create({send:req.session.userId,receive:req.body.room,msg:req.body.message})

         }catch(err){
            console.log(err)
            return res.status(500).json({error:"something went wrong"})
         }
    },

    getMessage: async(req,res) =>{
         console.log('its coming')
         console.log(req.body)
         try{
            const msgs = await message.findAll({where:{send:req.body.room,receive:req.session.userId}})
            console.log('msgs',msgs.map(o=>o.msg))
            res.send(msgs.map(o=>o.msg))

         }catch(err){
            console.log(err)
            return res.status(500).json({error:"something went wrong"})
         }
    },



    logout: async(req,res) => {
        req.session.destroy(function(err) {
             // cannot access session here
          })
          res.send('yo')
    },

    protected: (req,res) =>{

        res.status(200).json({message:"Inside protected route"})
    },

    refresh: async(req,res) => {
        const refreshToken = req.body.token
        const user = req.body.user
        if(!refreshToken){
            res.status(400).json({message:'User not authenticated'})
        }
        verify(refreshToken,"refresh",(err, decoded) => {
            if(err){
                res.json({message:"Invalid refresh  token"});

            }else{
                const newtoken = sign({result: user},"qwe1234",{expiresIn:'30m'})
                res.status(200).json({newtoken})
            }
        })
    }

        
   
    
}