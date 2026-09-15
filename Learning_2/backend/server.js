import express from 'express'
import 'dotenv/config'
import route from './src/routes/auth.route.js'

const app=express()
const PORT=process.env.PORT || 3000


app.use(express.json())
app.use('/api/auth',route)
app.get('/',(req,res)=>{
    return res.send("message:Hi World")
})

app.listen(PORT,()=>console.log(`Server is running on PORT ${PORT}`))

export default app