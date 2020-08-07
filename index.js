const express = require('express')


let app = express()

app.get('/',(req,res)=>{
    res.send('tes');
})

app.listen(3000)