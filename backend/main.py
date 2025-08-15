from flask import Flask, request, jsonify

from model.schema import get_model_data
import json

app = Flask(__name__)

@app.route('/dict/')
def get_word():
    word = request.args.get('word')
    targeted_language = request.args.get('targeted_language') or "Telugu"

    if not word:
        return jsonify({'error': 'Missing "word" or "targeted_language" query parameter'}), 400

    response = get_model_data(
        word=word,
        target_language=targeted_language
    )
    json_output = response.model_dump_json(indent=2)
    parsed_data = json.loads(json_output)
    return jsonify(parsed_data)

if __name__ == '__main__':
    app.run(debug=True)
