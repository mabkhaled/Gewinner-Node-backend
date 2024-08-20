const express = require('express');
const bodyParser = require('body-parser');
const compareAudioRoute = require('./src/routes/compareAudioRoute');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use('/compare_audio', compareAudioRoute);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
