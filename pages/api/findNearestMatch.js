import { createClient } from "@supabase/supabase-js";

export default async function findNearestMatchHandler(req, res) {
    
  /** Supabase config */
  const privateKey = process.env.SUPABASE_API_KEY;
  if (!privateKey) throw new Error(`Expected env var SUPABASE_API_KEY`);
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error(`Expected env var SUPABASE_URL`);
  
  const supabase = createClient(url, privateKey);
  const vectorDBURL = process.env.SUPABASE_URL;
  const vectorDBKey = process.env.SUPABASE_API_KEY;
  const { embedding } = req.body

  if (req.method === 'POST') {

    try {
      const { data } = await supabase.rpc('match_movies', {
        query_embedding: embedding,
        match_threshold: 0.20,
        match_count: 3
      });
      // console.log('findNearestMatch', data) // check terminal
      
      return res.status(200).json(data)

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}