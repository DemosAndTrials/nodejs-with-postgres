//var ET_Client = require('fuelsdk-node');
import ET_Client from 'fuelsdk-node';

var SDKClient;
var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;
var stack = process.env.STACK;

if (clientId) {
    SDKClient = new ET_Client(clientId, clientSecret, stack);
    //load up the first token.
    SDKClient.FuelAuthClient.getAccessToken(SDKClient.FuelAuthClient); //second param here can be a callback. or you change this to use promises like fuel-rest.
}

module.exports = SDKClient;