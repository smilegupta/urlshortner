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
const usersdB = admin.firestore().collection("usersdB");

app.use(static);
app.use(bodyParser.json());

app.get("/:short", (req, res) => {
    const short = req.params.short;
    const doc = urlsdB.doc(short);
    doc.get().then((response) => {
        const data = response.data();
        if (data && data.url) {
            res.redirect(301, data.url);
        } else {
            res.send("There is no such entry present in the dB");
        }
    });
});

app.post("/admin/urls/", (req, res) => {
    const { email, password, short, url } = req.body;
    usersdB
        .doc(email)
        .get()
        .then((response) => {
            const user = response.data();
            if (user && user.email === email && user.password === password) {
                const doc = urlsdB.doc(short);
                doc.set({ url });
                res.send("Done");
            } else {
                res.send(403, "Not Possible");
            }
        });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
