// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
var $ = require("jquery");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('Messages/{roomId}/{messageId}').onCreate(event => {
    console.log('event.data: ', event.data);
    console.log('event.data.val() : ', event.data.val());

    const dataVal = event.data.val();
    if (!dataVal) {
        return console.log('Message data null! ');
    }

    const roomId = event.params.roomId; //이벤트가 발생한 방ID
    const sendMessageUserId = dataVal.uid; //메세지 발송자 ID
    const sendUserName = dataVal.userName; //메세지 발송자 이름
    const sendMsg = dataVal.message; //메세지
    const sendProfile = dataVal.profileImg ? dataVal.profileImg : ''; // 프로필 이미지
    const promiseRoomUserList = admin.database().ref(`RoomUsers/${roomId}`).once('value'); // 채팅방 유저리스트
    const promiseUsersConnection = admin.database().ref('UsersConnection').orderByChild('connection').equalTo(true).once('value'); // 접속자 데이터

    return Promise.all([promiseRoomUserList, promiseUsersConnection]).then(results => {
        const roomUsersSnapShot = results[0];
        const usersConnectionSnapShot = results[1];
        const arrRoomUserList =[];
        const arrConnectionUserList = [];

        if(roomUsersSnapShot.hasChildren()){
            roomUsersSnapShot.forEach(snapshot => {
                arrRoomUserList.push(snapshot.key);
            })
        }else{
            return console.log('RoomUserlist is null')
        }

        if(usersConnectionSnapShot.hasChildren()){
            usersConnectionSnapShot.forEach(snapshot => {
                const value  = snapshot.val();
                if(value){
                    arrConnectionUserList.push(snapshot.key);
                }
            })
        }else{
            return console.log('UserConnections Data가 없습니다');
        }

        const arrTargetUserList = arrRoomUserList.filter(item => {
            return arrConnectionUserList.indexOf(item) === -1;
        });


        console.log('arrTargetUserList : ',arrTargetUserList);
        const arrTargetUserListLength = arrTargetUserList.length;
        for(let i=0; i < arrTargetUserListLength; i++){
            console.log(`FcmId/${arrTargetUserList[i]}`);
            admin.database().ref(`FcmId/${arrTargetUserList[i]}`).once('value',fcmSnapshot => {
                console.log('FCM Token : ', fcmSnapshot.val());
                const token = fcmSnapshot.val();
                if(token){
                    const payload = {
                        notification: {
                            title: sendUserName,
                            body: sendMsg,
                            click_action :`http://fb-tutorial-chat.firebaseapp.com/?roomId=${roomId}`,
                            icon: sendProfile
                        }
                    };
                    admin.messaging().sendToDevice(token, payload).then(response => {
                        response.results.forEach((result, index) => {
                            const error = result.error;
                            if (error) {
                                console.error('FCM 실패 :', error.code);
                            }else{
                                console.log('FCM 성공');
                            }
                        });
                    });
                }

            });
        }

    });
});

// [START addMessage]
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
// [START addMessageTrigger]
exports.addMessage = functions.https.onRequest((req, res) => {
// [END addMessageTrigger]
  // Grab the text parameter.
  const original = req.query.text;
  // [START adminSdkPush]
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
  // [END adminSdkPush]
});
// [END addMessage]


// [START makeUppercase]
// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });
// [END makeUppercase]
// [END all]
