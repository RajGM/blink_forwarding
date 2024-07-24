const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Catch-all route to forward any request
app.all('*', async (req, res) => {
  const ngrokUrl = 'http://your_ngrok_address'; // Replace with your Ngrok address
  const targetUrl = `${ngrokUrl}${req.originalUrl}`;

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: { ...req.headers, host: new URL(ngrokUrl).host },
      data: req.body,
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send(error.message);
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
