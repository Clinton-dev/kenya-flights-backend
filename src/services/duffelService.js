import { Duffel } from "@duffel/api";

export const getFlights = async ({ origin, destination, departure_date, passengers }) => {
    const rawKey = (process.env.DUFFEL_API_KEY || "").trim();

    if (!rawKey) {
        throw new Error("❌ No Duffel API Key found in environment variables");
    }

    const duffel = new Duffel({ token: rawKey });

    const offerRequest = await duffel.offerRequests.create({
        slices: [
            {
                origin,
                destination,
                departure_date,
            },
        ],
        passengers: Array.from({ length: passengers }, () => ({ type: "adult" })),
        cabin_class: "economy",
    });

    const offers = offerRequest.data.offers || [];

    // console.log("Raw Duffel requests:", JSON.stringify(offerRequest, null, 2));

    console.log("Raw Duffel offers:", JSON.stringify(offers, null, 2));

    return offers
        .map((offer) => ({
        flight_number: offer.slices[0].segments[0].operating_carrier_flight_number,
        departure_time: offer.slices[0].segments[0].departing_at,
        arrival_time: offer.slices[0].segments[0].arriving_at,
        price: `${offer.total_currency} ${offer.total_amount}`,
    }));

    // TODO: Filter by specific airline code if needed
    /*
    return offers
        .filter((offer) =>
            offer.slices.some((slice) =>
                slice.segments.some((segment) => segment.operating_carrier.iata_code === "ZZ")
            )
        )
        .map((offer) => ({
            flight_number: offer.slices[0].segments[0].operating_carrier_flight_number,
            departure_time: offer.slices[0].segments[0].departing_at,
            arrival_time: offer.slices[0].segments[0].arriving_at,
            price: `${offer.total_currency} ${offer.total_amount}`,
        }));
    */
};
