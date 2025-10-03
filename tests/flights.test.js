import request from "supertest";
import express from "express";
import flightsRouter from "../src/routes/flights.js";

const app = express();
app.use(express.json());
app.use("/searchFlights", flightsRouter);

describe("POST /searchFlights", () => {
    it("should return 400 for missing input", async () => {
        const res = await request(app).post("/searchFlights").send({});
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should return flights (mocked Duffel)", async () => {
        // Mock Duffel service response
        jest.unstable_mockModule("../src/services/duffelService.js", () => ({
            getFlights: async () => [
                {
                    flight_number: "KQ402",
                    departure_time: "2025-10-10T08:00:00",
                    arrival_time: "2025-10-10T09:15:00",
                    price: "KES 8,500"
                }
            ]
        }));

        const { searchFlights } = await import("../src/controllers/flightsController.js");
        const mockApp = express();
        mockApp.use(express.json());
        mockApp.post("/searchFlights", searchFlights);

        const res = await request(mockApp).post("/searchFlights").send({
            origin: "NBO",
            destination: "MBA",
            departure_date: "2025-10-10",
            passengers: 1
        });

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("flight_number", "KQ402");
    });
});
