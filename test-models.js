const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const options = {
  hostname: 'api.x.ai',
  path: '/v1/models',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${process.env.AI_API_KEY}`
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.data) {
        console.log("AVAILABLE MODELS:");
        parsed.data.forEach(m => console.log(m.id));
      } else {
        console.log("Response:", data);
      }
    } catch (e) {
      console.log("Raw response:", data);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
