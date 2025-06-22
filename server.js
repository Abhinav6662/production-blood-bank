const path=require('path')
const express=require('express');
const dotenv=require('dotenv')
const colors=require('colors')
const morgan=require('morgan')
const cors=require('cors');
const connectDB = require('./config/db');
const auth=require('./routes/authRoutes')
const inventoryRoutes=require('./routes/inventoryRoutes')
const analyticsRoutes=require('./routes/analyticsRoutes')
const adminRoutes=require('./routes/adminRoutes')

dotenv.config()


const app=express();
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://production-blood-bank-gbkr.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.options('*', cors()); // Pre-flight support
app.use(express.json())
app.use(morgan('dev'))

app.use("/api/v1/auth",auth)
app.use("/api/v1/inventory",inventoryRoutes)
app.use("/api/v1/analytics",analyticsRoutes)
app.use("/api/v1/admin",adminRoutes)


app.use(express.static(path.join(__dirname, './client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/dist/index.html'));
});

const PORT=process.env.PORT||8080
app.listen(PORT,(req,res)=>{
  console.log(`http://localhost:${PORT}`)
})
