const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const path = require("path");
const staticRoute = require("./routes/staticRouter")
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth")

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("mongodb connected"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", restrictToLoggedinUserOnly, urlRoute);

app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));



app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },
        {
            $push: {
                visitHistory: { timestamp: Date.now() }
            }
        })
    res.redirect(entry.redirectURL);
})

app.listen(PORT, (req, res) => console.log(`server started at port: ${PORT}`));