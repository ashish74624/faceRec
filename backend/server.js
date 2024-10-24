// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/studentRoutes');
const cors = require('cors')
const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/attendance-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/students', studentRoutes);
app.use(cors({
  origin: '*',
  // methods :['GET','PUT','POST','DELETE']
}));

app.get('/',async(req,res)=>{
  return res.json("How")
})

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
