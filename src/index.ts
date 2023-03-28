// import and run server
import { server, io } from "./app";
import { getTime } from "./utils";

server.listen(process.env.PORT, () => {
  console.log("Server running on port ", process.env.PORT);
  setInterval(() => {
    const time = getTime();
    if (time.split(":")[2] == "00") {
      console.log(time);
      if (
        time.split(":")[1] == "00" ||
        time.split(":")[1] == "15" ||
        time.split(":")[1] == "30" ||
        time.split(":")[1] == "45"
      ) {
        // Do something
      }
    }
  }, 1000);
  //socketConnect(io);
  console.log(process.version);
});
