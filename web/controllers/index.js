const pkg = require('../package.json');

module.exports = {
    get: (req, res) => {
        return res.send({
            name: pkg.displayName,
            version: pkg.version,
            author: pkg.author,
        });
    },
    create: async (req, res) => {},
    update: async (req, res) => {},
    remove: async (req, res) => {},
};
