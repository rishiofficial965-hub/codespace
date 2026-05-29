import app from "./src/app.js";
import connectToDb from "./src/config/db.js";

connectToDb()

const PORT = process.env.PORT || 3000


app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})