import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DotenvFlow from "dotenv-flow";
import post from "./routes/postRoute"; 
import faq from "./routes/faqRoute"
import employeeRoute from "./routes/employeeRoute"

dotenv.config();
DotenvFlow.config()

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Use the post routes
app.use("/posts", post); 
app.use("/employees", employeeRoute )
app.use("/faq", faq)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});