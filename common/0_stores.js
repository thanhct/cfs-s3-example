Stores = {};

 Stores.s3thumb = new FS.Store.S3("s3thumb", {
   accessKeyId: "your_accesskey", //required
   secretAccessKey: "your_secret", //required
   bucket: "namsoft-photo-blog", //required,
   folder:"thumbs",
   transformWrite: function(fileObj, readStream, writeStream) {
     // Transform the image into a 60px x 60px PNG thumbnail
     gm(readStream).resize(160).stream('PNG').pipe(writeStream);
     // The new file size will be automatically detected and set for this store
   }
 });
Stores.s3origin = new FS.Store.S3("s3origin", {
  accessKeyId: "your_access", //required
  secretAccessKey: "you_secret", //required
  bucket: "namsoft-photo-blog" //required,
});
//});
// var anyStore = new FS.Store.S3("any", {
//   accessKeyId: Meteor.settings.accessKeyId, //required
//   secretAccessKey: Meteor.settings.secretAccessKey, //required
//   bucket: Meteor.settings.anyStoreBucket //required
// });

Stores.images = new FS.Store.FileSystem("images", {
  path:"~/uploads"
});
Stores.thumbs = new FS.Store.FileSystem("thumbs", {
  path: "~/uploads/thumbs",
  beforeWrite: function(fileObj) {
    // We return an object, which will change the
    // filename extension and type for this store only.
    return {
      extension: 'png',
      type: 'image/png'
    };
  },
  transformWrite: function(fileObj, readStream, writeStream) {
    // Transform the image into a 60px x 60px PNG thumbnail
    gm(readStream).resize(160).stream('PNG').pipe(writeStream);
    // The new file size will be automatically detected and set for this store
  }
});

Stores.any = new FS.Store.FileSystem("any", {
  path: "~/uploads"
});