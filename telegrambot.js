const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
//ddd1//IPL
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = getFirestore();
// replace the value below with the Telegram token you receive from @BotFather
const token = '6035339258:AAF129x_IhnLKKqNiKgQJw6zos459u3bwEk';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
 bot.on("message", function(msg){
  const mg = msg.text;
  const newMsg = mg.split(" ")
  
  if(newMsg[0]=="SYMOF")
  {
  request('https://api.dictionaryapi.dev/api/v2/entries/en/'+newMsg[1], function(err, responce, body){
   //let data = JSON.parse(body)  
   const chatId = msg.chat.id;
   
   if((JSON.parse(responce.body))[0]){
    const data=JSON.parse(body)[0].meanings[0].synonyms;
   const x=data[0];
   // bot.sendMessage(chatId,'Data not found');
    
    if(x==null){
    //bot.sendMessage(chatId, 'Received your message'+data);
    bot.sendMessage(chatId,'No Synonyms is  found in my data');
    db.collection('SYMN').add({
      WORD:newMsg[1],
      SYNOMS:"No Synonyms is  found in my data",
      USERID:msg.from.id
   })
    }
    else{
      
      bot.sendMessage(chatId, 'Synonyms of '+" "+newMsg[1]+" is "+data);
      db.collection('SYMN').add({
        WORD:newMsg[1],
        SYNOMS:data,
        USERID:msg.from.id
    })
      
    }
   }
    else{
      //bot.sendMessage(chatId, 'Received your message'+data);
      bot.sendMessage(chatId,'Data not found');
      db.collection('SYMN').add({
        WORD:newMsg[1],
        SYNOMS:"Data not found",
        USERID:msg.from.id
    })
    }
    //console.log(data[0]); 
   });
  //END OF REQ
  }
  else if(newMsg[0]=="GETALL")
  {
    db.collection('SYMN').where('USERID', '==', msg.from.id).get().then((docs)=>{
      docs.forEach((doc) => {
       // console.log( doc.data().WORD + " " + doc.data().SYNOMS)
            bot.sendMessage(msg.chat.id,  "The Synonyms of "+ doc.data().WORD + " are " + doc.data().SYNOMS)
          });
    })
  }
  else if(newMsg[0]=="WORDSONLY")
  {
    bot.sendMessage(msg.chat.id,"Words till you enterd are..");
    db.collection('SYMN').where('USERID', '==', msg.from.id).get().then((docs)=>{
      docs.forEach((doc) => {
       // console.log( doc.data().WORD + " " + doc.data().SYNOMS)
            bot.sendMessage(msg.chat.id,   doc.data().WORD)
          });
    })

  }
  else{
       bot.sendMessage(msg.chat.id,"plz.. enter a proper command... To get synonyms of a wordenter SYMOF your word & To get all words & there synonyms use GETALL ");
       bot.sendMessage(msg.chat.id,"To get only words plz use WORDSONLY");
  }
 });
//DATABASE CODE





