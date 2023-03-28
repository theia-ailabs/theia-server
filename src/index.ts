// import and run server
import { server, io } from "./app";
import { socketConnect } from "./services/socket";
import { PORT } from "./config";
import { getTime } from "./utils";

server.listen(PORT, () => {
  console.log("Server running on port ", PORT);
  socketConnect(io);
  console.log(process.version);
  setInterval(() => {
    const time = getTime();
    if (time.split(":")[2] == "00") {
      console.log(time);
    }
  }, 1000);
});
