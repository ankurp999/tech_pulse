const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const app = require("./app");





// 🔗 MongoDB Connection
connectDB();
const PORT = process.env.PORT || 3000;

//route coming 
// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
