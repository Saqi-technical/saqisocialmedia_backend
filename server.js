const express = require('express');
const bodyParser = require('body-parser');

const morgan = require('morgan');
const cors = require('cors');
const app = express();
const dotenv = require("dotenv")
dotenv.config()
app.use(bodyParser.json())
app.use(morgan('dev'));
// Cor's Option
const corsOptions = {
    origin: "*",
    "Access-Controll-Allow-Origin": "*",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.get('/',(req,res)=>{
   return res.send('Welcome to my API');
})

const adminRoutes = require("./routes/adminRoutes")
const userRoutes = require("./routes/userRoutes")
const orderRoutes = require("./routes/orderRoutes")
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order',orderRoutes)



const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
