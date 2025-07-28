const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/stream', (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send('Missing nimblesessionid');
  }

  const url = `https://ptvstream1.nayatel.com:8096/transcoder/ptvhometrc_source/chunks.m3u8?nimblesessionid=${id}`;

  const options = {
    url,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      'Referer': 'https://ptv.com.pk',
      'Origin': 'https://ptv.com.pk',
      'Connection': 'keep-alive',
    },
  };

  request
    .get(options)
    .on('response', response => {
      if (response.statusCode === 403) {
        console.log(`403 Forbidden: Check session ID or headers`);
      }
    })
    .on('error', err => {
      console.error(err);
      res.status(500).send('Proxy error');
    })
    .pipe(res);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Proxy running on http://0.0.0.0:${port}`);
});
