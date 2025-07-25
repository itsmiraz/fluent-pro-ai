import axios from "axios";


 const chatWithOllama = async ({
  messages,
  model = 'mistral',
}: {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  model?: string;
}) => {
  const response = await axios.post('http://localhost:11434/api/chat', {
    model,
    messages,
  });

  return response.data;
};




export const ChatServices = {
    chatWithOllama
}

