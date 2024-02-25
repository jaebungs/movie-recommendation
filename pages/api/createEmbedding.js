import OpenAI from 'openai';
// import { createClient } from "@supabase/supabase-js";

export default async function createEmbeddingHandler(req, res) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");

  if (req.method === 'POST') {
    const { prompt } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    try {
      const openai = new OpenAI({ apiKey })
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: prompt,
        encoding_format: "float"
      });

      // console.log('Embedding response',response) // check terminal
      return res.status(200).json(response.data);
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}