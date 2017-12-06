import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

// Content above is ember specific shit, don't change.

// CTRL-F + ? to find comments marking issues
// CTRL-F + ^^ to find comments marking possible additional features if time allows

/*		For Programming Reference (class/Ids used) :
		- Settings -
		.short-break
		.long-break
		.study-time

		- To Do -
		#todo
		#task-list	-append todo entries here
*/

$(document).ready( function(){

		var shortBreak = 5, longBreak = 25, studyTime = 25;
		var interval = studyTime;
		var isStudyTime = true;
		var pomsperset = 4; //provide a way to choose amount of poms before long break? 3 or 4^^
		var poms = 0;

		var paused = false;
		
		var username;
		var expiration = 365; // time in days until user cookie expires


		// Save Options with Cookie ********************************************************************

		function setCookie( cname, cvalue, exdays) {
				var d = new Date();
				d.setTime(d.getTime() + (exdays*24*60*60*1000));
				document.cookie = cname + "=" + cvalue + "; expires="+d.toUTCString() + ";path=/";
		}

		//if cookie expired call deleteUSER

		function getCookie(cname) {
				var name = cname + "=";
				var decodedCookie = decodeURIComponent(document.cookie);
				var ca = decodedCookie.split(';');
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
				while (newuser =="" | newuser == null | userInDB()) {
						if (!userIsValid(newuser)){ 
								newuser = prompt("That username is taken, please choose another: ", "");
						} else {
								newuser = prompt("Please enter a unique username: ", "");
						}
				}
				addUser(user);
				return newuser;
		}

		function checkCookie() {
				var user = getCookie("user");
				if (user != "") { //cookie exists
						username = user;

				} else {
						user = getNewUser();
						setCookie("user", user, expiration);
				}
		}

		checkCookie();
		saveSettings();


		// DataBase Functions / Set User Settings  *****************************************************
		
		function userIsValid(user){  
				// return true if user not in DB or if user is expired, false if not <- Molly?
				return true;
		}

		function addUser(user) {
				// add user and a time stamp to DB
		}

		function saveSettings(user) {
				// save shortbreak, long, etc to DB

		}

		function restoreSettings() {
				// set whatever settings (short break, long break, etc) from DB and display should update automatically
		}

		$('#changeSettings').click(function() {
				var txt, confmsg = "Your current progress and timer will be reset, are you sure?\n To Do list will be saved.";
				if (confirm(confmsg) == true)
				{
						//update database values <- Molly?

						shortBreak = $('.short-break').val();
						longBreak = $('.long-break').val();
						studyTime = $('.study-time').val();
						
						$('#pause').text("Pause");
						restartTimer();
				}
		});
		
		
		// Change The Display Functions ****************************************************************

		$('#pause').text("Start");
		
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
		
		$('#title').text(username +"'s Pomodoro"); //Personalize title with username from cookie

		// Communicate with User - used to display message after intervals of study or break 
		function say(message){
				alert("message") //going to change later?
		}


		// Interval Options     ************************************************************************
		// Short Break Options
		for (var i=1; i<=10; i++){
				$(".short-break").append("<option>"+i+"</option>");
		}
		// Long Break Options
		for (var i=10; i<=30; i++){
				$(".long-break").append("<option>"+i+"</option>");
		}
		// Study Time Options
		for (var i=20; i<=30; i++){
				$(".study-time").append("<option>"+i+"</option>");
		}


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
								interval = studyTime;
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
						restartTimer(interval = getInterval(), 0); //start next interval
				}

				var minutes = Math.floor((distance) / minute),
				seconds = Math.floor((distance % minute) / second),
				milliseconds = distance % second,
				countdownElement = document.getElementById('timer');

				countdownElement.textContent = minutes + ':' + seconds;
		}

		// What happens when interval has ended:
		function timerEnd() {
				console.log("timer ended");
				console.log(studyTime);
				
				switch (interval){
						case studytime: 
								console.log('is study time');

								if (isStudyTime){ 	// Added extra check in case studyTime and 
													// longBreak are the same amount.
										poms++;		// VERY IMPORTANT
										if (isTimeForLongBreak) { say("Nice work. Take a break!");}	// add a feature to pull a message randomly from a list^^ ie: "Time for a snack!", "Nice work!", "Let's get shit done"
								}
								//else { continue; }	// should skip the break and jump to case long break.
								break;				// not sure if works yet.
						case longBreak:
								say("Time to get back to work!");
								break;
						case shortBreak:
								say("Time to Study!");
				}
				//Make an alarm sound play when pom has ended?
				
		}

		function startTimer(m, s) {
				console.log(interval);
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

		function restartTimer(){
				poms = 0;
				pauseTimer();
				startTimer(interval = getInterval(), 0);
		}



		// *****************************************************************************************


		// Add code to append to do list items and strike them out when clicked?
		// Keep in a database and associate with a session cookie?
		
		// Add way to keep track of completed poms?

});

loadInitializers(App, config.modulePrefix);

export default App;
