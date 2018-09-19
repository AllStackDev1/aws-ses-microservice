# aws-ses-micro-service
A micro-service which makes use of aws ses sdk to send email if you do not want to use other third parties api.

This project start off as when I was blocked by mailChimp due to sending an email to an email address that was wrongly spelt(my fault), and 
the omnivore AI they use doesn't play and it takes forever to resolve this issue. 
so I decide to create a micro service which will query my db, get the name and email of the users and send the mail to them accordingly using;
aws ses sdk, with express/node js.

**This is my first offically app with nodejs** 
