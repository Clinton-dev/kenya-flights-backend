import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const DUFFEL_API_URL = "https://api.duffel.com/air/offer_requests";
const DUFFEL_API_KEY = process.env.DUFFEL_API_KEY;

app.post("/searchFlights", async (req, res) => {
  try {
    const { origin, destination, departure_date, passengers, trip_type } = req.body;

    if (!origin || !destination || !departure_date || !passengers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const requestPayload = {
      cabin_class: "economy",
      passengers: Array.from({ length: passengers }, (_, i) => ({ type: "adult" })),
      slices: [
        {
          origin,
          destination,
          departure_date,
        },
      ],
    };

    const { data } = await axios.post(DUFFEL_API_URL, requestPayload, {
      headers: {
        Authorization: `Bearer ${DUFFEL_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const offers = data.data?.offers || [];

    const kqFlights = offers
      .filter((offer) =>
        offer.slices.some((s) =>
          s.segments.some((seg) => seg.operating_carrier.iata_code === "KQ")
        )
      )
      .map((offer) => ({
        flight_number: offer.slices[0].segments[0].operating_carrier_flight_number,
        departure_time: offer.slices[0].segments[0].departing_at,
        arrival_time: offer.slices[0].segments[0].arriving_at,
        price: `${offer.total_currency} ${offer.total_amount}`,
      }));

    res.json(kqFlights);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
