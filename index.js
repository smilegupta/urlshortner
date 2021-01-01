const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

var admin = require("firebase-admin");

var serviceAccount = require("./url-shortner-1a6de-firebase-adminsdk-62rax-7175d3a9f5.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const static = express.static("public");

const urlsdB = admin.firestore().collection("urlsdB");


app.use(static);
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   console.log("We  intercepted the request")
//   next();
// })

app.get("/:short", (req, res) => {
    console.log(req.params);
    const short = req.params.short;
    const doc = urlsdB.doc(short);
    doc.get().then((response) => {
        const data = response.data();
        if (data && data.url) {
            res.redirect(301, data.url);
        } else {
            // res.redirect(301, "https://github.com/smilegupta");
            res.send("There is no such entry present in the dB")
        }
    });
});

app.post("/admin/urls/", (req, res) => {
    console.log(req.body);
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
