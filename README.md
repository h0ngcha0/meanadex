## Mootee Manifesto

[![wercker status](https://app.wercker.com/status/b91bf3f2fa58d4db274292c9780702c2/m/master "wercker status")](https://app.wercker.com/project/bykey/b91bf3f2fa58d4db274292c9780702c2)

Paul Graham made a good point that programming is very much like
painting. You start from scratch with some vague sense of
orientation, and whatever you end up with after a few iterations might
not resemble even remotely what was in your mind in the first place.

Great artists steal. We can try to reverse engineer teespring.com,
at the time of writing, the site look like this:

![teespring screenshot](https://raw.github.com/liuhongchao/images/master/monadex/teespring-140318.jpg)

### A Brief Tour of teeeeeee-spring flow

  * Sign-up with teespring or use Google, Facebook or Yahoo! credentials.
  * It features a pretty user friendly design panel, offers user to add text, choose color and upload their own design images. Users can choose the material for their tshirts as well.
  * This is followed up by a campaign page where the various attributes of the campaign can be set, e.g. deadline, quantity, retail price, etc.
  * Users can preview the campaign
  * Finally the campaign page with a permanent URL which user can distribute either to their own websites or whatever channel they prefer (wechat, Facebook, etc)
  * Customers will be asked about the size of the shirt, shipping address, email, creditcard details, etc, when attempting to buy t-shirts
  * Users can use admin dashboard to manage all the campains he has (CRUD operations).

### Generate test data

After starting a fresh system with

      npm start

you can generate some test data using

      grunt populateTestData

This will generate an admin user with username set to ```admin``` and
password set to ```password```. It will generate a sample tshirt as well.

### Bulk upload artworks

If we want to upload a set of artworks and give them certain tags, we
can run a grunt task called ```uploadImages```. It takes two
parameters: ```path``` and ```tags```. For example:

      grunt uploadImages --path='../mootee_pics/dog/*' --tags='dog animal'

### Resources

All roads lead to Rome, the question is which one is the shortest. We
wanna use the coolest and most fun technology that does the job the
quickest. Sometimes, taking a free ride is not a bad idea either.

  * [AngularJs](https://angularjs.org/)
  * [MeanJs](http://meanjs.org/)
  * [SpreeCommerce](http://spreecommerce.com/)
  * [FabricJs](http://fabricjs.com/)

There are a great deal of stuff that we can borrow from the Spree
project, from business to architectural design to API design. See
their [documentation](http://guides.spreecommerce.com/api/)

Fabric provides higher level APIs for HTML5 canvas. There is a nice
series of tutorial from the original author:
[Introduction to Fabric.js](http://fabricjs.com/fabric-intro-part-1/)
