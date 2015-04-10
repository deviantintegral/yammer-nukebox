// Set login and password to your Yammer credentials.
// It is NOT RECOMMENDED to have the Inbox open while running this script.
// Read messages will be added to a list at the bottom of the page without
// ever removing them. A hundred messages caused Fluid to use 2GB+ of memory.
var login = 'me@lullabot.com';
var password = 'this should be long and unique';

var casper = require('casper').create({
  verbose: true,
  logLevel: 'info'
});

// The total number of messages to mark as read.
var messageCount;

// A counter for keeping unique screenshot names.
var captureIndex = 1;

/**
 * Helper to capture a screenshot.
 * @param t
 */
function captureState(t) {
  t.capture('step-' + captureIndex + '.png');
  captureIndex++;
}

casper.start('https://www.yammer.com/lullabot.com/?show_login=true');

// Log in to Yammer and fetch the number of unread messages.
casper.then(function() {
  this.waitUntilVisible('input#password', function() {
    this.log('Logging in to Yammer.', 'info');
    this.fill('#login-form', {
        'login': login,
        'password': password
      }, true
    );
  });
  this.waitUntilVisible('span.unread-count', function() {
    messageCount = parseInt(this.getElementInfo('span.unread-count').text, 10);
  })
});

// Hold until we have a message count.
casper.waitFor(function() {
  return messageCount != null;
},
function() {
  // Repeat the three steps to mark a message as read.
  this.log("Need to mark " + messageCount + " messages as read.", 'info');
  var processed = 0;

  casper.repeat(messageCount, function() {
    // Wait until the Inbox button is visible.
    casper.then(function() {
      this.waitUntilVisible('#uni-messages');
    });

    // Open the inbox and click the first unread message.
    casper.thenOpen('https://www.yammer.com/lullabot.com/#inbox/index', function() {
      // We also have a 1s pause here because Yammer was timing out under the load.
      this.wait(1000);

      this.waitUntilVisible('div.yj-inbox-unread-list li.yj-unread-item', function() {
        this.click('div.yj-inbox-unread-list ul li.yj-unread-item:first-child');
        processed++;
      });
    });

    // Go back to the inbox listing.
    casper.then(function() {
      this.waitUntilVisible('button.yj-thread-view-toolbar--back', function() {
        this.log("Marked " + processed + "/" + messageCount + " messages read.", 'info');
        this.click('button.yj-thread-view-toolbar--back');
      });
    });
  });
});

casper.run();
