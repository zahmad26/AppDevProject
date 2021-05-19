const output = (message, body) => {
    if (!body) {
        return {
            header: {
                error: 1,
                message: message
            }
        };
    } else {
        return {
            header: {
                error: 0,
                message: message
            },
            body: body
        };
    }
};

module.exports = output;