var ACCESSTOKEN = "ycTYYvHhtrncGnW7EgY63CR6Ego5AdHGCAeBVhaxuDKv2gfUbs7jLFXFKIc1dvNin5LANOlRzWrbZ1X9LchKDT6NhAjoIKYTLMTYk/nlAb5dVU7aEBa8k5vyPd1zbAA8pR6ok6NFPo5dKbWIO35DdAdB04t89/1O/w1cDnyilFU="

//spreadSheetの設定
var id = '17gcDsVF12pifMKQ0FV3rrONftLGVr4-_oAs8GZdS_W4';
var spreadsheet = SpreadsheetApp.openById(id);

var URL = "https://api.line.me/v2/bot/message/reply"; // 応答メッセージ用のAPI URL



// ボットにメッセージ送信/フォロー/アンフォローした時の処理
function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  var reply_token = json.events[0].replyToken;
  var user_id = json.events[0].source.userId;
  var user_message = json.events[0].message.text; //ここにメッセージが格納される

  // ユーザー名を取得する場合は、user_idから取得する必要がある。あと、ここはresponseという変数名に格納しないとエラーになる？
  var response = UrlFetchApp.fetch(
    'https://api.line.me/v2/bot/profile/' + user_id,
    {
      "headers": {
        "Authorization": "Bearer " + ACCESSTOKEN,
      }
    }
  );
  profile = JSON.parse(response);
  var username = profile.displayName

  var today = new Date();
  var month = today.getMonth() + 1;
  var date = today.getDate();
  var hour = today.getHours();
  var minute = today.getMinutes();
  

  // 時間帯によってかえる
  switch (true) {
    case hour <= 11:
      var period = "morning";
      break
    case hour <= 18:
      var period = "afternoon";
      break
    case hour <= 24:
      var period = "night";
      break

    case hour <= 5:
      var period = "midnight";
      break

    default:
      var period = "earlymorning";
      break
  }
  const findTargetRow = (vals, today) => {
    const index = vals.findIndex((date) => {
      return date[date.length - 1].toLocaleString() === today.toLocaleString()
    })
    return index + 1
  }


  const isEmpty = (cell) => {
    return cell.getValue() === ''
  }


  const main = () => {
    const sheet = SpreadsheetApp.openById('17gcDsVF12pifMKQ0FV3rrONftLGVr4-_oAs8GZdS_W4');
    const dates = sheet.getRange('A:A').getValues()
    const row = findTargetRow(dates, new Date(new Date().setHours(0, 0, 0, 0)))
    const startTimeCell = sheet.getRange(`B${row}`)
    const stopTimeCell = sheet.getRange(`C${row}`)

    const today = new Date()
    var h = today.getHours();
    var min = ("0" + today.getMinutes()).slice(-2);
    var s = today.getSeconds();
    const time = h + ':' + min + ':' + s;

    switch (true) {
      case isEmpty(startTimeCell):
        startTimeCell.setValue(time)
        break;
      case isEmpty(stopTimeCell):
        stopTimeCell.setValue(time)
        break;
      default:
    }
  }

  if (user_message.includes('NFCスタレコ')) {
    main();
    //返信
    if (period == "afternoon") {
      textMessage = username + 'さん、こんにちは！いつもNFCスタレコをつかってくれて、ありがとう！';
    } else if (period == "night") {
      textMessage = username + 'さん、こんばんは！努力は裏切らないよ！';
    } else if (period == "midnight")
      textMessage = username + 'さん、遅くまでお疲れさま！たまにリラックスも大切！';
    else
      textMessage = username + 'さん、おはようございます！毎日の積み重ねが大切だね';
    pushMessage(textMessage, reply_token);
  }

  // 合計時間の確認

// if (user_message.includes('時間確認')){
//   // const sheet = SpreadsheetApp.openById('17gcDsVF12pifMKQ0FV3rrONftLGVr4-_oAs8GZdS_W4');
//   const timeSum = sheet.getRange("D1");
//   textMessage = timeSum
//   pushMessage(textMessage, reply_token);

}
  



/*メッセージを送信*/
function pushMessage(textMessage, replyToken) {
  UrlFetchApp.fetch(URL, {
    "headers": {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + ACCESSTOKEN,
    },
    "method": "post",
    "payload": JSON.stringify({
      "replyToken": replyToken,
      "messages": [{
        "type": "text",
        "text": textMessage,
      }],
    }),
  });

}