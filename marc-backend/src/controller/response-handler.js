export const setSuccess = (data, response) => {
    response.status(200);
    response.json(data);
}

export const setError = (error, response) => {
    response.status(500);
    response.json({
        code: "ServerError",
        message: error.message
    });


}