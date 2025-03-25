from google import genai
from flask import Flask, render_template, request
import json
import os

from valid import deal
app = Flask(__name__)

#database config

key = os.getenv('api_key')


@app.route("/", methods=["GET", "POST"])
def index():
    
    form = deal(request.form)
    return render_template("home.html", form= form)

@app.route("/details", methods=["GET", "POST"])
def ai():
    
    if request.method == "GET":
        return "got get request"
    if request.method == "POST":
        form = deal(request.form)
        data = form.data
        title = data['product_input']
        
        user = f"Itemtitle:{data['product_input']}; description:{data['description']};" 
        
        try:
            client = genai.Client(api_key=key)
            response = client.models.generate_content(
            model="gemini-2.0-flash-exp", contents= user +'''. write description under 300 word, and why to buy in JSON format.
    Output should be in this format:
    {
        "description": "...",
        "why_to_buy": "...",
        "pros": [],
        "cons": [],
        "similar-products": []
    }'''
        )
            raw_text = response.text.strip()  # Remove leading/trailing spaces

    # Fix AI-generated formatting issues (e.g., removing ```json and ``` markers)
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]  # Remove the first 7 characters (` ```json `)
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]  # Remove the last 3 characters (` ``` `)
            json_response = json.loads(raw_text)  # Removing markdown syntax if present
            #data = json.loads(json_response)
            return render_template("details.html", data=json_response,  title = title)
            return json_response
        except json.JSONDecodeError:
            return {"error": "Invalid JSON response from API"}
        except Exception as e:
            return {"error": str(e)}

    
@app.route("/detail", methods=["GET", "POST"])
def details():
    return render_template("details.html")

if __name__ == "__main__":
    app.run(debug=True)

