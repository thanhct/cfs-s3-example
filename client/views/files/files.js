Template.files.created = function () {
  this.filename = new ReactiveVar('');
};

var s3thumb = "https://s3-ap-southeast-1.amazonaws.com/namsoft-photo-blog/thumbs/files/";
var s3origin = "https://s3-ap-southeast-1.amazonaws.com/namsoft-photo-blog/files/"

// Can't call getHandler until startup so that Collections object is available
Meteor.startup(function () {
  Template.files.events({
    'change input.any': FS.EventHandlers.insertFiles(Collections.Files, {
      metadata: function (fileObj) {
        return {
          owner: Meteor.userId(),
          s3thumburl: s3thumb  + fileObj._id + '-' + fileObj.name(),
          s3originurl: s3origin + fileObj._id + '-' + fileObj.name()
        };
      },
      after: function (error, fileObj) {
        if (!error) {
          console.log("Inserted", fileObj.name());
        }
      }
    }),
    'keyup .filename': function () {
      var ins = Template.instance();
      if (ins) {
        ins.filename.set($('.filename').val());
      }
    },
    // Catch the dropped event
    'dropped #dropzone': function(event, temp) {
      console.log('files dropped');
      FS.Utility.eachFile(event, function(file) {
        Collections.Files.insert(file, function (err, fileObj) {
          //If !err, we have inserted new doc with ID fileObj._id, and
          //kicked off the data upload using HTTP
        });
      });
    }
  });

});

Template.files.helpers({
  uploadedFiles: function() {
    return Collections.Files.find();
  },
  curl: function () {
    var ins = Template.instance(), filename = '';
    if (ins) {
      filename = ins.filename.get();
    }

    if (filename.length === 0) {
      filename = 'example.txt';
    }

    var authObject = {
      authToken: Accounts._storedLoginToken() || '',
    };

    // Set the authToken
    var authString = JSON.stringify(authObject);
    var authToken = FS.Utility.btoa(authString);

    return 'curl "' + Meteor.absoluteUrl('cfs/files/' + Collections.Files.name) + '?filename=' + filename + '&token=' + authToken + '" -H "Content-Type: text/plain" -T "' + filename + '"';
  },
  s3token: function() {
    var authObject = {
      authToken: Accounts._storedLoginToken() || '',
    };

    // Set the authToken
    var authString = JSON.stringify(authObject);
    var authToken = FS.Utility.btoa(authString);
    return '?token=' + authToken;
  }
});
