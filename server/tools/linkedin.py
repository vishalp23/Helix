import http.client
import json
import os
from dotenv import load_dotenv

load_dotenv() 

class LinkedInSearchAPI:
    def __init__(self):
        self.api_key = os.getenv('RAPIDAPI_KEY')
        self.host = os.getenv('RAPIDAPI_HOST', "linkedin-public-search.p.rapidapi.com")

    def search_candidates(self, keyword, page=1, limit=10):
        conn = http.client.HTTPSConnection(self.host)

        payload = json.dumps({"keyword": keyword})

        headers = {
            'x-rapidapi-key': self.api_key,
            'x-rapidapi-host': self.host,
            'Content-Type': "application/json"
        }

        try:
            conn.request("POST", f"/postsearch?page={page}&includePostURLs=false&limit={limit}", payload, headers)
            res = conn.getresponse()
            data = res.read()
            result = json.loads(data.decode("utf-8"))
            return result
            

        except Exception as e:
            return {"error": str(e)}

        finally:
            conn.close()