'use strict';

var keyMirror = require('keymirror');

module.exports = keyMirror({
    DRAFT: null, // troc is being drafted (like when you are searching something), not available
    PENDING: null, // awaiting validation from moderators, not available
    ONGOING: null, // validated by moderator, available
    ACCEPTED: null, // a proposal has been been accepted, but not yet fulfilled
    FULFILLED: null, // troc has been fuilfilled
    CANCELED: null // troc has been canceled, not available
});
