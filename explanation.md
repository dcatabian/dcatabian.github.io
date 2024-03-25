Derrick C - 30106757
SENG 513 LEC 01 LAB B01
ASSIGNMENT 3 SUBMISSION
NOV 13 2023

Complex Component 1: Getting the game to wait for input

 - initially was going to use a while true loop in moments that the game was
   going to wait for player input
	- game needed keyboard input
	- enter a while loop that constantly checks a global variable
	- set the keyboard listener to set the aforementioned global variable
 - when generators were introduced, became the obvious solution
	- no more wasted computation cycles
 - any time the game is played, an object is set to be the generator that
   runs it
 - when the game needs input is when the generator should yield
 - so if the game is looking for specific input, it loops the yield until
   the desired input is recorded
   
 - see app.js lines 298-316. Code commented that explains above
 
Complex Component 2: Setting up input to only be taken when needed

 - above sounds good in concept, but implementation was a challenge
 - as the game required waiting periods, and yielding, it required specific input recording
   momentss so that sleep periods don't interfere with input
 - thus the keyboard event listener had to be separated from the game loop function
 - the game loop object is declared seperate from both so that it can exist independently from
   the keyboard listener and initialize the game loop
 - thus the listener and game loop are codependent, periods when keyboard input needs to be
   recorded follow a pattern:
	- keyboard listener is set
	- game enters a loop - this loop has no sleep periods
	- upon entering the game function yields and stops execution
	
	- the keyboard listener is activated by a key being pressed down
	- the key then calls next for the game loop, passing the input recorded
	
	- game loop continues with the keyboard listener calling it
	- it processes the input
	
	- when the game does not require input it exits the loop and removes the keyboard listener
	
Complex Component 3: The game window

 - Game had to manipulate DOM elements, which are kind of finnicky to position in the first place
 - Decided almost immediately that the game window would be a fixed size, with absolutely positioned
   elements being the assets
 - all game window elements are given absolute positioning
 - then these elements are classified as either being left (player 1 assets), right (player 2 assets) or
   middle (universal assets)
 - middle take whole game window width and center themseleves horizontally
 - left and right are set with according css attributes
 - then each element is classified specifically for their offset from the top/bottom of the game window
 
 - this is evident in the classes assigned under the game-window div in index.html and styling.css
 - as for the lose animations, app.js just takes the current syle offsets and adds/subtracts to them, making
   one function able to be used for any player position