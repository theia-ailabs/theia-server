import os
import pyttsx3
from gtts import gTTS


def voiceReader(txt='Hello, World!'):
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')
    engine.setProperty('voice', 'en-gb-x-fis#female_1')
    engine.setProperty('rate', 150)
    engine.setProperty('volume', 0.8)
    engine.say(txt)
    engine.runAndWait()
    return 0


def femaleReader(txt='Hello, World!', lang='es'):
    tts = gTTS(text=txt, lang=lang, slow=False)
    tts.save("theia.wav")
    os.system("mpg123 theia.wav tempo 2.5")
    # os.remove("audio.mp3")


if __name__ == '__main__':
    voiceReader()
    femaleReader()
