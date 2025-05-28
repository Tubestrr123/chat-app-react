import express from 'express';
import { json } from 'body-parser';
import { SessionsClient } from '@google-cloud/dialogflow';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(json());

const projectId = 'your-dialogflow-project-id';
const sessionClient = new SessionsClient({
  keyFilename: 'key.json',
});

app.post('/dialogflow', async (req, res) => {
  const { text, sessionId } = req.body;
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: 'id',
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.send({ reply: result.fulfillmentText });
  } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).send('Error connecting to Dialogflow');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
