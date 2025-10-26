const express = require('express')
const router = express.Router()

router.get('/home',async(req,res)=>{
    try{
        res.render('home/index',{user:null});
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})

module.exports = router;