const express = require('express')
const app = express()
const path = require('path')
const PORT = 8080
const mongoose = require('mongoose')


const seedVenue = require('./Seed/venueSeed')
const seedCater = require('./Seed/caterSeed')
const seedPhotographer = require('./Seed/photographerSeed')
const seedDecor = require('./Seed/decorSeed')
const seedGuest = require('./Seed/guests')


const venueRoutes  = require('./Routes/venue')
const caterRoutes = require('./Routes/caters')
const homeRoutes = require('./Routes/home')
const photographersRoutes = require('./Routes/photographers')
const decorRoutes = require('./Routes/decor')
const guestRoutes = require('./Routes/guests')
const budgetRoutes = require("./Routes/budget");
const methodOverride = require("method-override");


const ejsMate = require('ejs-mate')

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))


app.use(methodOverride("_method"));



mongoose.connect('mongodb://127.0.0.1:27017/evento')
.then(()=>{
    console.log("DB Connected Successfully")
})
.catch((err)=>{
    console.log("DB Error")
    console.log(err)
})


// seedVenue()
// seedCater()
// seedPhotographer()
// seedDecor()
// seedGuest()


app.use(express.urlencoded({ extended: true }));



app.use(venueRoutes)
app.use(caterRoutes)
app.use(homeRoutes)
app.use(photographersRoutes)
app.use(decorRoutes)
app.use('/guests', guestRoutes);
app.use(budgetRoutes);




app.listen(PORT,()=>{
    console.log(`Server Connected At ${PORT}`)
})