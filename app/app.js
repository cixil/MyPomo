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

		// Add code to update variables for the time segments, short, long, study?
		var shortBreak = 5, longBreak = 25, studyTime = 25;
		var interval = studyTime;
		var isStudyTime = true;
		var pomsperset = 4; //provide a way to choose amount of poms before long break? 3 or 4^^
		var poms = 0;

		// Interval Options     ************************************************************************
		//$('#st').selectpicker('val','5');
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


		// Communicate with User ************************************************************************
		function say(message){
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
		countdown("timer", interval = getInterval(), 0);

		function countdown( elementName, minutes, seconds )	{

				var element, endTime, hours, mins, msLeft, time;
				function twoDigits( n )	{ return (n <= 9 ? "0" + n : n);}

				function updateTimer()
				{
						msLeft = endTime - (+new Date);
						if ( msLeft < 1000 ) {          // Pomodoro has ended
								switch (interval){
										case studytime: 
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
								alert("Pomodoro Ended!"); //Make an alarm sound play when pom has ended?
								countdown("timer", interval = getInterval(), 0); // Start next interval.
						} else {
								time = new Date( msLeft );
								hours = time.getUTCHours();
								mins = time.getUTCMinutes();
								element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' 
										+ twoDigits( time.getUTCSeconds() );
								setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
						}
				}

				element = document.getElementById( elementName );
				endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
				updateTimer();
		}

		// add a way to pause timer?


		// Add code to append to do list items and strike them out when clicked?
		// Keep in a database and associate with a session cookie?
		
		// Add way to keep track of completed poms?

});

loadInitializers(App, config.modulePrefix);

export default App;
