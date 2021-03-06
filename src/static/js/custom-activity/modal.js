requirejs.config({
    paths: {
        postmonger: 'js/postmonger'
    }
});

// Postmonger Events
// https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/using-postmonger.htm
define(['postmonger'], function (Postmonger) {
    'use strict';

    var connection = new Postmonger.Session();

    $(window).ready(function () {
        console.log("*** MODAL READ ONLY ***");
        connection.trigger('ready');
    });

    // - Broadcast in response to the first ready event called by the custom application.
    //   This is typically done on $(window).ready()
    // - Response (payload): { name: 'MyActivity', metaData: {}, arguments: {}, configurationArguments: {}, outcomes: {} }
    // - When the activity is dragged from the activity list initially (meaning that it has no existing data),
    //   the default activity structure is pulled from the custom application's config.json.
    //   If the activity is a configured activity, the existing saved JSON structure of the activity is passed.
    connection.on('initActivityRunningHover', function (payload) {
        console.log('initActivityRunningHover');
        console.log('payload', JSON.stringify(payload));

        if (payload) {
            var jsonPayload = payload['arguments'].execute.inArguments;

            if (typeof jsonPayload != "undefined" && jsonPayload.length > 0) {

                // saved inputs always first element
                var content = jsonPayload[0];
                Object.keys(content).forEach(function(key) {
                    console.log('Key : ' + key + ', Value : ' + content[key])
                    var selector = '#' + key;
                    var value = content[key];
                    $(selector).val(value);
                })
            }
        }

    });

    connection.on('initActivityRunningModal', function (payload) {
        console.log('initActivityRunningModal');
        console.log('payload', JSON.stringify(payload));

        if (payload) {
            var jsonPayload = payload['arguments'].execute.inArguments;

            if (typeof jsonPayload != "undefined" && jsonPayload.length > 0) {

                // saved inputs always first element
                var content = jsonPayload[0];
                Object.keys(content).forEach(function(key) {
                    console.log('Key : ' + key + ', Value : ' + content[key])
                    var selector = '#' + key;
                    var value = content[key];
                    $(selector).val(value);
                })
            }
        }

    });

});
