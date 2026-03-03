exports.ping = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'pong',
        timestamp: new Date().toISOString()
    });
};

exports.healthCheck = (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok',
        service: 'Groww Clone Backend Platform',
        environment: process.env.NODE_ENV
    });
};
