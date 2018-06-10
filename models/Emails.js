var mongoose = require("mongoose");

var emailSchema = new mongoose.Schema({}, { strict: false });


module.exports = mongoose.model('emails', emailSchema);
// module.exports = mongoose.model('vpcflowlogs', vpcflowlogsSchema, 'vpcflowlogs');
