// test-duffel.js
import { Duffel } from "@duffel/api";
import dotenv from "dotenv";

dotenv.config();

const duffel = new Duffel({ token: process.env.DUFFEL_API_KEY });

(async () => {
    try {
        const airlines = await duffel.airlines.list();
        console.log("Success ✅ Duffel connected:", airlines[0]);
    } catch (err) {
        console.error("Duffel auth failed ❌", err);
    }
})();
