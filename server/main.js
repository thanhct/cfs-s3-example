Meteor.startup(function() {
  //ImageUploads.remove({});
  console.log("Images Uploads:", Collections.Images.find().count());
  console.log("Files:", Collections.Files.find().count());

  Collections.Images.on('removed', function (fileObj) {
    console.log("Removed " + fileObj._id + " from Images collection.");
  });


  FS.File.prototype.S3Url = function(storeName) {
    var self = this;
    var store = self.getCollection().storesLookup[storeName];
    var urlHost = 'https://s3-ap-southeast-1.amazonaws.com/';
    var urlPath = [store.bucket, store.folder, this.copies[storeName].key].join('/');
    return urlHost + urlPath;
  };
});

Meteor.methods({
  testUrlInsert: function() {
    return Collections.Images.insert("http://cdn.morguefile.com/imageData/public/files/b/bboomerindenial/preview/fldr_2009_04_01/file3301238617907.jpg");
  },
  testFileInsert: function () {
    return Collections.Images.insert("/Users/Eric/Downloads/testfile.jpg");
  },
  rotate: function() {
    Collections.Images.find().forEach(function (fileObj) {
      var readStream = fileObj.createReadStream('images');
      var writeStream = fileObj.createWriteStream('images');
      gm(readStream).swirl(180).stream().pipe(writeStream);
    });
  }
});