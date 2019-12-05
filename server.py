from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def root():
    print(request.json)

    return "hi"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
