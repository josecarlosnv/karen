import express from "express";
import cors from "cors";
import morgan from "morgan";

import EMT_dimensions from "./routes/EMT_dimensions.route.js";
import EMT_tables from "./routes/EMT_tables.route.js";
import EMT_vistas from "./routes/EMT_vistas.route.js";

import { authAD } from "./controllers/EMT_tbl_Security.controller.js";//by Isaac
import { PORT } from "./database/config.js";

const app = express();


const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:5173/EQCR_Monitoring_Tool",
  "http://localhost:5174/EQCR_Monitoring_Tool",
  "http://mxmexapp295",
    "http://mxmexapp295:8085",   
  "http://mxmexapp295:8443",
  "http://mxmexapp295/EQCR_Monitoring_Tool",
  "https://mxmexapp295/EQCR_Monitoring_Tool"
];

app.get("/debug-user", (req, res) => {
  res.json({
    xForwardedUser: req.headers["x-forwarded-user"],

    ALL_HEADERS: req.headers,

    IISNODE_VERSION: process.env.IISNODE_VERSION,

    username: process.env.USERNAME,
    userdomain: process.env.USERDOMAIN
  });
});
app.get("/debug-auth", (req, res) => {
  res.json({
    xForwardedUser: req.headers["x-forwarded-user"],
    xIisNodeUser: req.headers["x-iisnode-logon_user"],
    headers: req.headers
  });
});
app.get("/debug-env",(req,res)=>{
  res.json({
    IISNODE_VERSION: process.env.IISNODE_VERSION,
    PORT: process.env.PORT,
    USERNAME: process.env.USERNAME,
    USERDOMAIN: process.env.USERDOMAIN,
    COMPUTERNAME: process.env.COMPUTERNAME
  });
});

app.get("/debug-server-vars", (req, res) => {
  res.json({
    username: process.env.USERNAME,
    userdomain: process.env.USERDOMAIN,
    COMPUTERNAME: process.env.COMPUTERNAME,
    AUTH_USER: process.env.AUTH_USER,
    REMOTE_USER: process.env.REMOTE_USER,
    LOGON_USER: process.env.LOGON_USER,
    AUTH_TYPE: process.env.AUTH_TYPE,
    IISNODE_VERSION: process.env.IISNODE_VERSION
  });
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // para Postman o llamadas internas

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.options("*", cors());
app.get("/test-user", (req, res) => {
  res.json({
    url: req.originalUrl,
    user: req.headers["x-iisnode-logon_user"],
    headers: req.headers
  });
});


app.get("/debug-env2", (req, res) => {
    res.json({
        LOGON_USER: process.env.LOGON_USER,
        AUTH_USER: process.env.AUTH_USER,
        REMOTE_USER: process.env.REMOTE_USER,
        AUTH_TYPE: process.env.AUTH_TYPE,
 
        USERNAME: process.env.USERNAME,
        USERDOMAIN: process.env.USERDOMAIN,
        IISNODE_VERSION: process.env.IISNODE_VERSION
    });
});

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(authAD);

app.use("/api", EMT_dimensions);
app.use("/api", EMT_tables);
app.use("/api", EMT_vistas);

export default app;
