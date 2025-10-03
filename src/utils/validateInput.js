export const validateInput = ({ origin, destination, departure_date, passengers }) => {
    if (!origin) return "Origin is required";
    if (!destination) return "Destination is required";
    if (!departure_date) return "Departure date is required";
    if (!passengers || passengers < 1) return "Passengers must be at least 1";
    return null;
};
