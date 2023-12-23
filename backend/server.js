const app = require("./app");
const connectDatabase = require("./config/database");

// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down due to uncaught exception");
  process.exit(1);
});

//config , we installed dotenv to configure our port and if condition
// as it is only required when running on localhost
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

//connecting to db
connectDatabase();


const server = app.listen(process.env.PORT, () => {
  console.log(`server is running at http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("shutting down due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
