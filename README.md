Yammer Nukebox
==============

The Yammer inbox is super annoying, and doesn't have a "mark all as read"
function. This CasperJS script goes through all of your messages and marks them
as read.

<em>Why Casper, and not an API call?</em>
I wanted to learn casper, and the Yammer API is kind of painful to use. If the
API now supports marking messages as read (it previously didn't), then alternate
implementations are totally welcome.

Nuking your Inbox
-------

1. Install casperjs.
1. Set your Yammer username and password in the header.
1. Make sure you're not viewing the inbox in your browser, or be prepared for
   your browser to use a *ton* of RAM.
1. `casperjs nukebox.js`

It takes about a second per message to run due to server limits on Yammer's
side. If you have more than 1000 unread messages, it may take several runs
as Yammer will start pushing old unread messages into the queue.
