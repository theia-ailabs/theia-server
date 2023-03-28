import whisper
import wave
import struct
from pvrecorder import PvRecorder
from services.apis.openai_api import davinci
from services.reader_ai import femaleReader


def theiaWhispers(audio):
    model = whisper.load_model("base")
    text = model.transcribe(audio)
    text = text["text"]
    print('\n', text)
    result = davinci(text)
    print('\n', result)
    return {
        'audio': femaleReader(result),
        'text': text
    }


def localWhisper():
    result = ''
    try:
        # load audio drivers
        for index, device in enumerate(PvRecorder.get_audio_devices()):
            print(f"[{index}] {device}")
        # init recorder driver
        recorder = PvRecorder(device_index=-1, frame_length=512)
        path = 'input.wav'
        audio = []
        recorder.start()
        while True:
            frame = recorder.read()
            audio.extend(frame)
    except KeyboardInterrupt:
        recorder.stop()
        with wave.open(path, 'w') as f:
            f.setparams((1, 2, 16000, 512, "NONE", "NONE"))
            f.writeframes(struct.pack("h" * len(audio), *audio))
        model = whisper.load_model("base")
        text = model.transcribe(path)
        text = text["text"]
        print('\n', text)
        result = davinci(text)
        print('\n', result)
        femaleReader(result)
    finally:
        recorder.delete()
        return result


if __name__ == '__main__':
    localWhisper()
