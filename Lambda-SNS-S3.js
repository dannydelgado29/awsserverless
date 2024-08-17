'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "us-east-1"});
const S3 = new AWS.S3({ apiVersion: "2006-03-01" });

module.exports.sendEmail = async (event, context, callback) => {
  
  const sns = new AWS.SNS({
    region: 'us-east-1'
  })
  
  const params = {
    Subject: 'My first test message',
    Message: 'This is my first test message from SNS. \n If you receive this message, then you have done a good job!',
    TopicArn: 'arn:aws:sns:us-east-1:116133827911:firstlambda'
  }
  
  const publishToSNS = async () => {
    try {
      const { MessageId } = await sns.publish(params).promise();
      console.log(`Your message with id ${ MessageId } has been delivered.`);
    } catch (e) {
      console.log(e)
    }
  }
  
  const resp = await publishToSNS();
  return resp;
  
};


module.exports.uploadFile = async (event, context, callback) => {
 
 try {  
  const  parseBody  = JSON.parse(event.body);
  const base64File = parseBody.file;
  const encoded = base64File.replace(/^data:image\/\w+;base64,/, '');

  const imageBuffer = Buffer.from(encoded, 'base64');

  const params = {
    Bucket: "students-bucket-2024-labs",
    Key: `${Date.now()}.png`,
    Body: imageBuffer,
    ACL: 'public-read',
    ContentType: 'image/png' ,
  }
  await S3.upload(params).promise();
 } catch (error) {
  console.error('Error uploading picture:', error);
  return {
    statusCode: 500,
    body: JSON.stringify('Error uploading file'),
  };  
 }
 const responseBody = {
  "message": "File upload succesfull", 
};

 const response = {
  "statusCode": 200,
  "headers": {
      "my_header": "my_value"
  },
  "body": JSON.stringify(responseBody),
  "isBase64Encoded": false
};

 return  response;

};
