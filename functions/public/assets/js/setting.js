
// 로그아웃
function logout(){
  if (confirm("로그아웃 하시겠습니까?")) {
    firebase.auth().signOut().then(function() {
    location.href="/";
  }).catch(function(error) {
    // An error happened.
  });
  }
}

// 스케줄데이터 가져오기
function getDataSchedule(uid){
    var starCountRef = firebase.database().ref('user/'+uid+'/schedule/');
    var data=[];
    starCountRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        console.log(childSnapshot.val());
        data.push(childSnapshot.val());
      });
      return data;
    });
    return data;
}

// 스케줄추가 읿ㄴ
function insertSchedule(uid, data){
  firebase.database().ref('users/'+uid+'/schedule/').push({
    doctor : data.doctor,
    dday : dday,
    doctor_id : data.doctor_id,
    process : data.process,
    state : data.state
  });
}

// 의사추가
function addDoctor(uid,data) {
    firebase.database().ref('user/'+uid+'/doctor').push({
    dr_name : data.dr_name,
    dr_phone : data.dr_phone,
    dr_age : data.dr_age,
    h_name : data.h_name,
    h_addr : data.h_addr,
    h_tel : data.h_tel,
    h_code :data.h_code
  });
}

// 날짜 및 시간
function datearr(){
  var dates= new Object;
  var d = new Date();
  y =  d.getFullYear();
  m = d.getMonth()+1;
  dd = d.getDate();
  today =y+"-"+m+"-"+dd;
  h = d.getHours();
  i = d.getMinutes();
  s = d.getSeconds();
  time_now = h+":"+i+":"+s;
  dates = {
    y:y,
    m :m,
    dd : dd,
    today : y+"-"+m+"-"+dd,
    h : h,
    i : i,
    s :s,
    time_now : h+":"+i+":"+s,
    time_num : y+m+dd
  };
  return dates;
}
function inserquery(query, type, data){
  if (type =="push") {
    firebase.database().ref(query).push(data);
  }else if (type ="set") {
    firebase.database().ref(query).set(data);
  }else if(type = "update"){
    firebase.database().ref(query).update(data);
  }else if (type = "delete") {
    firebase.database().ref(query).update(data);
  }
}
function getquery(query,type,action){
  var starCountRef = firebase.database().ref(query);
  if (type == "on") {
    starCountRef.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        console.log(childSnapshot.val());
      });
    });
  }else if (type == "once") {
    starCountRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        console.log(childSnapshot.val());
      });
    });
  }
}
function loadUser(query){
  firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        location.href="/";
      }else {
        var scheduleDb = getDataSchedule(user.uid);
        console.log(scheduleDb);
        var starCountRef = firebase.database().ref('user/'+user.uid+'/schedule/');
        starCountRef.once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            console.log(childSnapshot.val());
          });
        });
      }
    });
}

function writeUserData(userId, phone) {
  var d = new Date();
  y =  d.getFullYear();
  m = d.getMonth();
  dd = d.getDate();
  today =y+"-"+m+"-"+dd;
  h = d.getHours();
  i = d.getMinutes();
  s = d.getSeconds();
  time_now = h+":"+i+":"+s;
  firebase.database().ref('users/' + userId).set({
    phone: phone,
    last_login : today+" "+time_now
  });
}


document.addEventListener('DOMContentLoaded', function() {
  $('.sidenav').sidenav();
  $('.collapsible').collapsible();
});
var nav_setting =`
  <nav>
  <div class="nav-wrapper">
    <a href="./" class="brand-logo"><img src="/assets/img/pladuo_logo.svg" alt=""></a>
    <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
    <a href="javascript:logout();" class="right" style="margin-right:15px;"><i class="material-icons">power_settings_new</i></a>
    <ul class="right hide-on-med-and-down pc_menu">
    <li><a href="clndr.html">스케줄</a></li>
    <li><a href="myinfo.html">등록정보</a></li>
    <li><a href="doctor.html">의사정보</a></li>
    <li><a href="adddoctor.html">의사 등록</a></li>
    </ul>
  </div>
  </nav>
  <ul class="sidenav" id="mobile-demo">
    <li><a href="./" class="brand-logo"><img src="/assets/img/pladuo_logo.svg" alt=""></a></li>
    <li><a href="clndr.html">스케줄</a></li>
    <li><a href="myinfo.html">등록정보</a></li>
    <li><a href="doctor.html">의사정보</a></li>
    <li><a href="adddoctor.html">의사 등록</a></li>
  </ul>
  <input type="hidden" name="uid" class="uid" value="">
`;
$("body").prepend(nav_setting);
