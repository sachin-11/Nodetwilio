const express = require('express');
const dotenv = require('dotenv')

dotenv.config()

const app = express();



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const PORT = process.env.PORT || 3000;44

app.post('/send', async (req, res) => {
    const code = Math.floor(1000 + Math.random() * 9000);
   try {
     const data = await client.messages
     .create({
        body: ` hi rahul your code is ${code}`,
        from: '+15076232990',
        to: '+917041200380'
      })


      res.status(200).send(data.sid)

   } catch (error) {
    console.log(error.message)
   }
})



app.listen(PORT, () => {
    console.log(`server is listen on port ${PORT}`)
})