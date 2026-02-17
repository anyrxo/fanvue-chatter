import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { ChatEngine } from './services/engine';

const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// TODO: Enable middleware once webhook secret is configured
// import { verifySignature } from './middleware/auth';
// app.use(verifySignature);

app.post('/webhook/message', async (req: Request, res: Response) => {
  try {
    const { creator_id, fan_external_id, message_content, fan_name } = req.body;
    
    if (!creator_id || !fan_external_id || !message_content) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const reply = await ChatEngine.handleMessage(creator_id, fan_external_id, message_content, fan_name);
    res.json({ reply });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/health', (req, res) => {
  res.send('Fanvue Chatter API is running');
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
