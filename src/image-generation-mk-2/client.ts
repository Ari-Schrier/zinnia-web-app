import axios from 'axios';
const apiKey = process.env.REACT_APP_SECRET_KEY;
const preamble = `You are a helpful assistant who assists users in brainstorming slideshows to be shown to dementia patients. When you are given a title for a slideshow, you suggest ten slides which might be put in a slideshow with that title. These slideshows are intended to be viewed by dementia patients. All slides should be nostalgic and non-threatening. Avoid any subjects which might frighten a viewer. Most slides should not focus on humans. Your response will be formatted as a JSON array and should look like this:

[
  {
    "id": "A unique identifier for the slide"
    "title": [
	    "title of slide. Should be short and descriptive",
	    "the title, translated into Spanish",
	    "the title, translated into French"
    ],
    "funFact": ["a brief interesting fact about the subject of the slide", "the same question, translated into Spanish", "The same question, translated into French"],
    "question": ["a short question about the subject of the slide. This question should be appropriate to ask a dementia patient. Yes/No questions are good, as are questions with one very easy to find answer", the same fact, translated into Spanish", "The same fact, translated into French"]
    "prompt": "A brief prompt which could be used with an AI image-generation model to create a photograph illustrating the slide. The prompt should be very simple. Simply state the subject, the scene around them, and choose an appropriate lens for the photo to have been taken with from the following choices: Sigma 85mm f/1.4, Sigma 85mm f/8, Nikon 55mm f/2.8 AF, and Sigma 24mm f/8"
  },
  {Repeat for all slides}
]`;

export const generateImage = async (prompt:any) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: 'dall-e-3',
          prompt: "I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:" + prompt,
          n: 1,
          size: '1792x1024',
          style: 'natural',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );
      return response.data.data[0].url;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  };
  
  export const generateJSON = async (title:any) => {
    try{
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model:'gpt-4o',
          messages: [
            {
              "role": "system",
              "content": preamble
            },
            {
              "role": "user",
              "content": title
            }
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      )
      return response.data.choices[0].message.content
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  };