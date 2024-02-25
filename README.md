## Simple Movie Recommendation
This AI can give a movie recommendation based on the answers.
Please note that there are not many movies in the database.
If no result is found, the app will say something like "Sorry, I couldn't find a good movie to recommend."

### Flow
1. Create embeddings for the questions and the answers.
2. Find matching movies from supabase vector DB.
3. Using the results from the above 2 steps, get recommendation with complete texts.

#### Tech
NextJS, OpenAI, Supabase Vector DB