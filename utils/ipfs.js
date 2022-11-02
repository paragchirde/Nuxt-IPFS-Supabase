import { create } from "ipfs-http-client";

const projectId = process.env.INFURA_ID; // <---------- your Infura Project ID

const projectSecret = process.env.INFURA_KEY; // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});
export default ipfs;
