import { getFlights } from "../services/duffelService.js";
import { validateInput } from "../utils/validateInput.js";

export const searchFlights = async (req, res, next) => {
    try {
        const validationError = validateInput(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const flights = await getFlights(req.body);
        res.json(flights);
    } catch (err) {
        next(err);
    }
};
