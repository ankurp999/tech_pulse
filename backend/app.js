const express = require("express");
const app = express();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");


// middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});


// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/tags", require("./routes/tagRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/blogs", require("./routes/likeRoutes"));
app.use("/api/products", require("./routes/productRoutes"));




app.use(errorHandler);

module.exports = app;
