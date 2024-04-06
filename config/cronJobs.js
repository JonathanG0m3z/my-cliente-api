const cron = require('node-cron')
const cronJobsController = require('../controllers/cronJobsController')

function initCronJobs() {
    // cron.schedule('0 8 * * *', () => {
    //     cronJobsController.sendEmailReminder()
    //         .then(() => {console.log('Ejecutado')})
    //         .catch((err) => console.log(err))
    // });
}

module.exports = {
    initCronJobs: initCronJobs
};