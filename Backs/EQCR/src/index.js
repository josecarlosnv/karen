import app from "./app.js";
//import { PORT } from "./database/config.js";

const port = process.env.PORT || 3000; //const port = process.env.PORT || PORT || 3000; //

app.listen(port, () => {
  console.log("Server on port", port);
});
