import axios from 'axios';
const apiKey = process.env.API_KEY;
const preamble = `You are a helpful assistant who assists users brainstorm images for slideshows. When you are given a title for a slideshow, you suggest three photographs which might fit into a slideshow with that title. These slideshows are intended to be viewed by dementia patients. All images should be nostalgic and non-threatening. For each photograph you generate, start by choosing a subject. Avoid any subjects which might frighten a viewer or be difficult to generate with AI. Most photographs should not focus on humans. Your response will be formatted as a JSON array and should look like this:

[
  {
    "title": "title of photograph. Should be short and descriptive",
    "description": "We want our descriptions to be simple. Limit use of adjectives. Just include the object being focused on and the background. This should end with a comma"
    "lens": "Choose ONE between sigma 85mm f/1.4, Sigma 85mm f/8, and Sigma 24mm f/8"
  },
  {Repeat for photos two and three}
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
    console.log(response.data.data[0].revised_prompt);
    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const generatePrompts = async (title:any) => {
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