//midlleware example
const logger = (req, res, next) => {
    console.log(`middleware ran and ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};

module.exports = logger;