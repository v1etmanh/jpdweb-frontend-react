import sys
import whisper
import difflib

def calc_similarity(ans, pred):
    return round(difflib.SequenceMatcher(None, ans, pred).ratio() * 100, 2)

audio_path = sys.argv[1]
expected_text = sys.argv[2]

model = whisper.load_model("small")
result = model.transcribe(audio_path, language="ja")

recognized_text = result["text"].strip()
similarity = calc_similarity(expected_text, recognized_text)

print(f"{recognized_text}|||{similarity}")
