const sdk = require("api")("@playht/v2.0#1rzmb37lgay32bn");

sdk.auth("Bearer 4bfb017af15f47efb676437cb3aaeaff");
sdk.auth("ROGcxNsWDhMrCMff29DOatUjrGE3");
sdk
  .postApiV2Tts(
    {
      quality: "medium",
      output_format: "mp3",
      speed: 1,
      sample_rate: 24000,
      text: "Hello, I'm Theia your AI assistant. How can I help you?",
      voice: "larry",
    },
    { accept: "text/event-stream" }
  )
  .then((data: any) => console.log(data))
  .catch((err: any) => console.error(err));
