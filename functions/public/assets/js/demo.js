// Call this from the developer console and you can control both instances
var calendars = {};
var theCalendarInstance;
var thisMonth = moment().format('YYYY-MM');

function clndr_make(eventarray){
  eventArray = eventarray;
  theCalendarInstance = calendars.clndr1 = $('.cal1').clndr({
      events: eventArray,
      clickEvents: {
          click: function (target) {
              console.log('Cal-1 clicked: ', target);
              $("td").removeClass("clicktd");

              var className = target.element.classList[1];
              if (className.length <20 ) {
                for (var i = 0; i < target.element.classList.length; i++) {
                  if (target.element.classList[i].length >20) {
                    className= target.element.classList[i];
                  };
                };
              };
              $("."+className).addClass("clicktd");
              console.log(className);
              $(".collapsible .schedule_list").remove();
              var cnt_event = target.events;
              for (var xx = 0; xx < cnt_event.length; xx++) {
                var active_class;
                if (xx==0) {
                  active_class ="active";
                }
                var inner_txt = '<li class="schedule_list">';
                  inner_txt+='<div class="collapsible-header class="'+active_class+'" schedule_name"><i class="material-icons">place</i>'+target.events[xx].title+'</div>';
                  inner_txt+='<div class="collapsible-body schedule_description">'+target.events[xx].content+'</div></li>';
                $(".collapsible").prepend(inner_txt);
                console.log(target.date._i);
              }
                $(".demo-date").val(target.date._i);
                $(".select_date").text(target.date._i);
          },
      },
      multiDayEvents: {
          singleDay: 'date',
          endDate: 'endDate',
          startDate: 'startDate'
      },
      showAdjacentMonths: true,
      adjacentDaysChangeMonth: false
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var db = firebase.database();
  var auth = firebase.auth();
  var eventArray;
  var clndr_data;

  firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        location.href="/";
      }else {
        var dateDate = datearr();
        $(".uid").val(user.uid);
        var starCountRef = firebase.database().ref('users/'+user.uid+'/schedule/');
        starCountRef.on('value', function(snapshot) {
          var eventArray =[];
          snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            // console.log(childData);
            var btn_chk;
            var content =childData.e_content;
            if (childData.e_btn == null) {
              btn_chk= "";
            }else {
              content += "<br>"+childData.e_btn;
            }
            if (childData.e_endDate == null ||childData.e_endDate == "" ) {
              var codes = {
                          title : childData.demo_hospital+childData.e_title,
                          content :content,
                          startDate : childData.e_startDate,
                        };
            }else {
              var codes = {
                          title : childData.demo_hospital+childData.e_title,
                          content :content,
                          startDate : childData.e_startDate,
                          endDate : childData.e_endDate
                        };
            }

                      console.log(codes);
                      eventArray.push(codes);
          });

          console.log(eventArray);
          clndr_make(eventArray);
          theCalendarInstance.setEvents(eventArray);
        });


      }
    });
});



    // Bind all clndrs to the left and right arrow keys
    $(document).keydown( function(e) {
        // Left arrow
        if (e.keyCode == 37) {
            calendars.clndr1.back();
        }

        // Right arrow
        if (e.keyCode == 39) {
            calendars.clndr1.forward();
        }
    });
// });
