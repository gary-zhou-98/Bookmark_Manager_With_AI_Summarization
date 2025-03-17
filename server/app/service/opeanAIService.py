from openai import OpenAI
import os
from dotenv import load_dotenv



def summarize_text(text: str) -> str:
  load_dotenv()

  try:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
  except Exception as e:
    print(f"Error creating OpenAI client: {e}")
    raise e
  
  if text is None or text.strip() == "":
    return ""
  
  text_chunks = text.split("\n")
  text_batch = []
  for i in range(0, len(text_chunks), 10000):
    text_batch.append("".join(text_chunks[i:i+10000]))
  
  messages = []
  messages.append({
            "role": "developer",
            "content": "You are a helpful assistant that summarizes text scrapped from a website. I will provide chunks of the full text across multiple mesages. The input of chunks would follow when the text ends with [END_OF_CHUNK]. "
            + "Please take each chunk into consideration for full context and summarize the entire text."
            + "The summarization should be precise and concise. Try to keep it at maximum 5 sentences if possible. And you should not include any additional information or commentary."
        })
  
  for text in text_batch:
    messages.append({
      "role": "user",
      "content": text
    })
  
  messages.append({
    "role": "user",
    "content": "[END_OF_CHUNK]"
  })
  
  try:
    response = client.chat.completions.create(
      model="gpt-4o-mini",
      messages=messages,
      temperature=0.3
    )
    return response.choices[0].message.content.strip()
  except Exception as e:
    print(f"Error summarizing text: {e}")
    raise e

