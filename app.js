$(document).ready( function(){
		var shortBreak = 5, longBreak = 25, studyTime = 25;
		var interval = studyTime;
		var isStudyTime = true;
		var pomsperset = 4;
		var poms = 0;
		var completedPomImage = "assets/images/favicon.png";

		var alarmPath = "assets/alarms/"; // path to alarm sounds
		var alarms = [
				{name:"Store Chime", path:(alarmPath + "store-chime.mp3")},
				{name:"Metronome", path:(alarmPath + "metronome.mp3")},
				{name:"Ship Bell", path:(alarmPath + "ship-bell.mp3")},
				{name:"Zen Temple", path:(alarmPath + "zen-temple.mp3")},
				{name:"Buzzer", path:(alarmPath + "buzzer.mp3")},
				{name:"EAS beep", path:(alarmPath + "eas-beep.mp3")}
				//{name:"", path:(alarmPath + "")},
		];
		var alarmIndex = 0; // default alarm
		//var repeat = toggleRepeat();
		var paused = false;
		
		var username;
		var expiration = 365; // time in days until user cookie expires


		// Sound Options *******************************************************************************
		for (var i = 0; i<alarms.length; i++) {
				$('.alarm-menu').append('<option>'+ alarms[i].name +'</option>');
		};

		$('.alarm-menu').change(function(){ playAlarm(); });

		function playAlarm(){
				alarmIndex = document.getElementById('sel1').selectedIndex;
				$('#audio').html('<audio id=\"audio'+alarmIndex+'\" source src=\"'+alarms[alarmIndex].path+'\" type=\"audio/mpeg\"></audio>');	
				document.getElementById("audio"+alarmIndex).play();
		}

		function toggleRepeat(){
				if ($('#repeat').prop('checked')){
						repeat = true;
				}
				else { repeat = false; }
		}


		// Save Options with Cookie ********************************************************************

		function setCookie( cname, cvalue, exdays) {
				var d = new Date();
				d.setTime(d.getTime() + (exdays*24*60*60*1000));
				document.cookie = cname + "=" + cvalue + ", expires="+ d.toUTCString() + ", path=/;";
				
				console.log("cookie set: " + document.cookie);
		}

		function getCookie(cname) {
				var name = cname + "=";
				var decodedCookie = decodeURIComponent(document.cookie);
				var ca = decodedCookie.split(',');
				for(var i = 0; i <ca.length; i++) {
						var c = ca[i];
						while (c.charAt(0) == ' ') {
								c = c.substring(1);
						}
						if (c.indexOf(name) == 0) {
								return c.substring(name.length, c.length);
						}
				}
				return "";
		}

		function getNewUser(){
				var newuser= "";
				while (newuser =="" | newuser == null ) {
					newuser = prompt("Please enter a unique username: ", "");
				}
				return newuser;
		}

		function checkCookie() {
				var user = getCookie("user");
				if (user != "") { //cookie exists
						console.log("cookie exists");
						username = user;
				} else {
						username = getNewUser();
						setCookie("user", username, expiration);
				}
		}

		checkCookie();
		restore();
		
		$('#update-settings').click(function() {
				var txt, confmsg = "Your current progress and timer will be reset, are you sure?\n To Do list will be saved.";
				if (confirm(confmsg) == true)
				{
						$('#pause').text("Pause");
						toggleRepeat();
						restore();
						resetPoms();
						restartTimer();
				}
		});

		function restore() {
				var sb = $('.short-break').val();
				var lb = $('.long-break').val();
				var st = $('.study-time').val();
				var poms = $('.pomsperset').val();
				var alarm = document.getElementById('sel1').selectedIndex; 
		}
		


		// Setup The Display ****************************************************************
		$('#pause').text("Start");
		$('#title').text(username +"'s Pomodoro");  // Personalize title with username from cookie
		$('#timer').text(add0(studyTime)+":00"); 			// set initial time display.
	
		// Communicate with User - used to display message after intervals of study or break 
		function say(message){
				alert(message) //going to change later?
		}


		// Pomodoro Buttons ****************************************************************************
		$('#pause').click(function(){
				switch($('#pause').text()) {
						case "Start":
								$('#pause').text("Pause");
								startTimer(interval=getInterval(), 0);
								break;
						case "Pause":	
								$('#pause').text("Resume");
								pauseTimer();
								break;
						case "Resume":
								$('#pause').text("Pause");
								resumeTimer();
				}
		});

		$('#reset').click(function(){
				var confmsg = "Reset the current interval?\nYou won't lose your completed pomodoro count.";
				if (confirm(confmsg)){
						startTimer(interval, 0);
				}
		});
		


		// Pomodoro technique algorithm to ensure the proper interval for the timer *********************
		var getInterval = function(){
				isStudyTime = true;
				switch (interval){
						case studyTime:
								interval = shortBreak;
								if (isTimeForLongBreak()){ interval = longBreak; }
								isStudyTime = false;
								break;
						case shortBreak:
								interval = studyTime;
								break;
						case longBreak:
								resetPoms();
				}
				if (poms == 0){
						interval = studyTime;
						isStudyTime = true;
				}
				return interval;
		}

		function isTimeForLongBreak(){
				return (poms % pomsperset == 0);
		}

		function pomCompleted(){
				if (poms == pomsperset) { 
						resetPoms();
				}
				else {
						poms++;
						$('#pom-tally').append('<img class=\"pom-tally-image\" src=\"'+completedPomImage+'\" alt=\"|\">');
				}
				
		}

		function resetPoms(){
				poms = 0;
				$('#pom-tally').html(" ");
		}
		$('.delete-poms').click(function(){
				if(confirm("Reset current progress? This will delete your completed pomodoro history and restart the timer.")){
						resetPoms();
						interval = studyTime;
						startTimer(interval, 0);
				}
		});
				

		// Timer *****************************************************************************************

		var second = 1000;
		var minute = second * 60;
		var end;
		var id;
		var value = "0:0";

		function showTimer() {
				var now = Date.now(),
				distance = end - now;

				if (distance <= 0) {
						clearInterval(id);
						timerEnd();
						restartTimer(); //start next interval
				}

				var minutes = Math.floor((distance) / minute),
				seconds = Math.floor((distance % minute) / second),
				milliseconds = distance % second,
				countdownElement = document.getElementById('timer');

				countdownElement.textContent = add0(minutes) + ':' + add0(seconds);
		}

		function timerEnd() { // What happens when interval has ended
				playAlarm();

				switch (interval){
						case studyTime: 
								if (isStudyTime){ 	// Added extra check in case studyTime and longBreak are the same amount.
										pomCompleted();		// VERY IMPORTANT
										if (isTimeForLongBreak) { say("Nice work. Take a break!");}	
								}
								break;				
						case longBreak:
								say("Time to get back to work!");
								break;
						case shortBreak:
								say("Time to Study!");
				}
		}

		function startTimer(m, s) {
				$('#pause').text("Pause");
				end = Date.now() + (m * 60 * 1000) + (s*1000);
				id = setInterval(showTimer, 10);
		}

		function pauseTimer() {
				value = timer.textContent;
				clearInterval(id);
		}

		function resumeTimer() {
				var t = value.split(":");
				startTimer( parseInt(t[0], 10), parseInt(t[1], 10));
		}

		function add0(n){
				if (n < 10) {
						return "0"+n;
				}
				return n;
		}

		function restartTimer(){
				pauseTimer();
				startTimer(interval = getInterval(), 0);
		}
});
