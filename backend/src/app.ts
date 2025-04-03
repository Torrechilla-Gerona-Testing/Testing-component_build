import express from "express";
import postRoute from "./routes/postRoute";
import employeeRoute from "./routes/employeeRoute";
import faqRoute from "./routes/faqRoute";

const app = express();

app.use(express.json()); 
app.use("/posts", postRoute); 
app.use("/employees", employeeRoute); 


export default app;
