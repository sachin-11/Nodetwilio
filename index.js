const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv')
const connectDB = require('./db/config')
const UserModel = require('./models/User.model')

dotenv.config()
connectDB();

const app = express();

app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const PORT = process.env.PORT || 3000;44

app.post('/send', async (req, res) => {
    const { phone, name  } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000);
   try {
      await client.messages
     .create({
        body: ` hi ${name} your code is ${code}`,
        from: '+15076232990',
        to: phone
      }).then((data) => {
        if(data) {
         res.status(200).json({ message: `Sms send successfully please check your phone ${phone}`})
        }
      }).catch((err) => {
         res.status(400).json({ message: err.message })
      })

      const user = await UserModel.findOne({phone: phone})
      if(user) {
         await UserModel.findOneAndUpdate({ _id: user._id}, {
           $set: { code: code }
         }, { new: true})

      } else {
         await UserModel.create({
            name,
            phone,
            code:code
         })
      }

   } catch (error) {
    console.log(error.message)
   }
})


app.post('/verify', async (req, res) => {
    try {
   const { code } = req.body;
     await UserModel.findOne({ code: code}).then(user => {
      if (user.code === code) {
         res.status(200).json({ message: `you have successfully verified`})
      } 
   }).catch(err => {
       return res.status(400).json({ message: `your otp is invalid please try again` });
   });
 
    } catch (error) {
      res.status(500).send({ message: 'Internal server Error' })
    }
})



app.listen(PORT, () => {
    console.log(`server is listen on port ${PORT}`)
})