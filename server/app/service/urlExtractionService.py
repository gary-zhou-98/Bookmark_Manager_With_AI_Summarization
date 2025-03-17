from bs4 import BeautifulSoup
import requests

def extract_url_content(url: str) -> str:
  try:
    source = requests.get(url).text
    soup = BeautifulSoup(source, "html.parser")
    text = soup.get_text("\n", strip=True)
    return text
  except Exception as e:
    print(f"Error extracting URL content: {e}")
    raise e
