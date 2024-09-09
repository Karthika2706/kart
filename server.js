const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
let posts = [];
let users = {}; 

app.post('/post', (req, res) => {
    const content = req.body.content;
    const post = { content, timestamp: new Date() };
    posts.push(post);
    res.status(201).send('Post created');
});
app.get('/feed', (req, res) => {
    res.json(posts);
});
app.use(express.static(__dirname));

app.listen(port, () => {
    console.log(`Microblogging app listening at http://localhost:${port}`);
});


