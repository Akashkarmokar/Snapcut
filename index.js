/**
 * Title : index file.
 * Description : Project entry point to which create server and handle request
 */

/**
 * Dependencies
 */
const express = require('express');
const fs = require('fs');

/**
 * App object
 */
const app = express();

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get('/video', (req, res) => {
    /**
     * Ensure range property on header object
     */
    const { range } = req.headers;
    if (!range) {
        res.status(400).send('Requires Range Header!');
    }
    const videoPath = `${__dirname}/demo.mp4`;
    const videoSize = fs.statSync(videoPath).size;

    const chunkSize = 10 ** 6; // ~1MB
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + chunkSize, videoSize - 1);

    /**
     * Header Object
     */
    const contentLength = end - start + 1;
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
    };
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});
/**
 * Creating server on 3000 port
 */
app.listen(3000, () => {
    console.log('Listening on porst 3000');
});
