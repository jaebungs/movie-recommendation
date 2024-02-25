import OpenAI from 'openai';

const chatMessages = [{
    role: 'system',
    content: `You are an enthusiastic movie expert who loves recommending movies to people. 
        You will be given three pieces of information - questions and the uers' answsers and some context about movies.
        Your main job is to formulate a short answer to the question using the provided context.
        If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.` 
}];

export default async function getChatCompletionsHandler(req, res) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");

  if (req.method === 'POST') {
    const apiKey = process.env.OPENAI_API_KEY;

    try {
      const openai = new OpenAI({ apiKey })
      const { questionsAndAnswers, context } = req.body

      // add initial questions, user answers and smilarity search result
      chatMessages.push({
        role: 'user',
        content: `Questions and Answsers: ${questionsAndAnswers} | Context: ${context}`
      });

      const response = await openai.chat.completions.create({
        messages: chatMessages,
        model: "gpt-3.5-turbo"
      });

      // console.log('chat.completions', response) // check terminal
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}