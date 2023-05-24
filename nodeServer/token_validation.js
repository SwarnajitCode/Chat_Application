const {verify} = require('jsonwebtoken');
const {sequelize, userchat, usertoken} = require('./models')

module.exports = {
    checkToken: async(req, res, next) =>{
        const token = req.session.token
        if(token){
             //trying to fetch the token
            const tokken = await usertoken.findOne({where:{userId:req.session.userId}})
           /* if(tokken){
                next()
            }else{
                res.json({message:"Invalid token"});
            }*/

            verify(token,"qwe1234",(err, decoded) => {
                if(err){
                    res.json({message:"Invalid token"});

                }else{
                    next();
                }
            })
        }else{
            res.json({message:"access denied!"})
        }
    },
    auth: async (req,res,next) => {
           
        let token = req.headers["authorization"]
        token = token.split(" ")[1]
        verify(token,"qwe1234",(err, decoded) => {
            if(err){
                res.json({message:"Invalid token"});

            }else{
                next();
            }
        })
    }
}