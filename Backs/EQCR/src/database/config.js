import { config } from "dotenv";
config();

export const PORT = 3000 || process.env.PORT;
export const DB_USER = process.env.DB_USER || "s_scorefyDeV";
export const DB_PASSWORD = process.env.DB_PASSWORD || "XdY$Ypg2GBi9Er&c0Xvf%gQ%L8vG7";
export const DB_SERVER = process.env.DB_SERVER || "MXMEXDB223.mx.kworld.kpmg.com";
export const DB_DATABASE = process.env.DB_DATABASE || "MEX_ITA_STA_BI_AUDIT";