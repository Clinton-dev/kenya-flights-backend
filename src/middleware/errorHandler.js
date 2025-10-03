export const errorHandler = (err, req, res, next) => {
    console.error("[Error Middleware]");

    // If error comes from Duffel SDK, it has .errors
    if (err.errors && Array.isArray(err.errors)) {
        console.error("Duffel API Error:", JSON.stringify(err.errors, null, 2));

        return res.status(err.meta?.status || 500).json({
            error: "Duffel API Error",
            details: err.errors.map((e) => ({
                title: e.title,
                message: e.message,
                code: e.code,
                documentation_url: e.documentation_url,
            })),
        });
    }

    // Fallback for generic errors
    console.error(err.message || err);
    res.status(500).json({ error: "Internal Server Error" });
};
