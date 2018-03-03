var log4js = require('log4js');
log4js.configure({
    appenders: {
        Ziroom2RSS: {
            type: 'file',
            filename: 'logs/Ziroom2RSS.log',
            maxLogSize: 20480,
            backups: 3,
            compress: true
        },
        console: {
            type: 'console'
        }
    },
    categories: { default: { appenders: ['Ziroom2RSS', 'console'], level: 'INFO' } }
});
var logger = log4js.getLogger('Ziroom2RSS');

module.exports = logger;