import express from 'express';
const app = express();

app.get('/', (req, res) => res.send('Server is working'));

app.listen(6000, () => console.log('✅ Test server running on http://localhost:6000'));
