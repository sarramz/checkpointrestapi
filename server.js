const express = require("express");
const app = express();
const router = express.Router();
//connect DB
const connectDb = require("./config/connectDb");
require("dotenv").config({ path: "./config/.env" });
connectDb();
//connect server
const port = process.env.PORT || 7000;
console.log(process.env.PORT);
app.listen(port, (err) => {
  err
    ? console.log("server is failed")
    : console.log(`server is running on ${port}`);
});
//routes
const User=require('./models/Users')
app.use(express.json())
//    GET :  RETURN ALL USERS
app.use("/api",router.get("/user", async (req, res) => {
    try {
        //on recupere les users puis on les stocke dans une tab
      const users = await User.find();
      //si la tab est vide alors db vide
      if (users.length == 0) {
        res.status(401).json({ msg: "your database is empty" });
      } else {
        //sinon on les affiches sous format json
        // res.status.json({users:users})
        res.status(200).json({ users });
      }
    } catch (error) {
      res.status(400).json({ msg: "somthing is wrong" });
    }
  }));
//POST :  ADD A NEW USER TO THE DATABASE

app.use("/api",router.post("/post",async(req,res)=>{
   //on met body que jai ecrit dans une variable user (objet)
    const user=req.body;
    console.log(user)
    try {
        //on test si cette objet existe ou pas
        const userFound=await User.findOne({email:user.email})
        console.log(userFound);
        //si elle existe on ne peut pas lajouter dans BD
        if(userFound){
            res.status(401).json({msg:'user already exist'})
        }else{
            //si elle nexiste pas il faut les mettre dans bd
            const newuser=new User({
                userName:user.userName,
                email:user.email,
                age:user.age,
            });
            //lenregistre
            await newuser.save()
            res.status(201).json({msg:'user is sucessfully saved',user:newuser})
        }
      
    } catch (error) {
        res.status(403).json({msg:'saving failed'})
    }
    
    }
    
    ));


//PUT : EDIT A USER BY ID
//pour modifier il faut recuperer lid puis on stocke le body dans une variable pour la mettre a la place de lencienne 
app.use("/api",router.put("/put/:id",async(req,res)=>{    
    const id=req.params.id;
    const userup=req.body;
    console.log(userup);
    try {
        //on test si cette objet existe si elle existe on modifie 
        await User.findByIdAndUpdate(id,userup);
        res.status(202).json({msg:'user is sucessfully updated'})
    } catch (error) {
        res.status(404).json({msg:'update is failed'})
    }
}));

//   DELETE : REMOVE A USER BY ID
//pour supprimer il faut recuperer lid puis on cherche cette objet pour le supp
app.use('api',router.delete('/delete/:id',async(req,res)=>{
    const id=req.params.id;
    try {
        await User.findByIdAndDelete(id);
        const users= await User.find();
        res.status(200).json({msg:'user is sucessfully deleted',users})
    } catch (error) {
        res.status(400).json({msg:'delete is failed'})
    }
    
}))
