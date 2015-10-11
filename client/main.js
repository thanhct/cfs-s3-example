Template.registerHelper('log', function () {
  console.log(this, arguments);
});

FS.File.prototype.S3Url = function(storeName) {
  var self = this;
  var store = self.getCollection().storesLookup[storeName];
  var urlHost = 'https://s3-ap-southeast-1.amazonaws.com/';
  var urlPath = [store.bucket, store.folder, this.copies[storeName].key].join('/');
  return urlHost + urlPath;
};