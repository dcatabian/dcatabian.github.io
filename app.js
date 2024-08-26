/*
Derrick C - 30106757
SENG 513 LEC 01 LAB B01
ASSIGNMENT 3 SUBMISSION
NOV 13 2023
*/

/*
    NOTES
    BG AND PLAYER IMAGES - x10 - 1px RESOLUTION = 10px ON PAGE
        PLAYER      90x90
        OFFSET 1    100-45
        OFFSET 2    200-45
        OFFSET 3    300-45
    KEYS - x5 - 1px RESOLUTION = 5px ON PAGE
        SINGLE      90x90
        H-OFFSET    155
        KEYGROUP    315x190
        H-OFFSET    74
    https://developer.mozilla.org/en-US/docs/Web/CSS/position - CSS: position: absolute
    https://stackoverflow.com/questions/14068103/disable-antialising-when-scaling-images for not blurring images
    https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event for keypresses
*/

//SOURCE ATTRIBUTION: https://stackoverflow.com/a/39914235
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
    Window Elements
*/

window.addEventListener("DOMContentLoaded", (e)=>{
    //game window elements
    const 
    [
        p1, p2, keygroup1, keygroup2, key1, key2,
        header, round_counter, win_announcement, win_time,
        p1messageA, p1messageB, p1MessageMiss,
        p2messageA, p2messageB, p2MessageMiss,
        play_again_btn
    ] = 
    [
        document.getElementById("p1"),
        document.getElementById("p2"),
        document.getElementById("kg1"),
        document.getElementById("kg2"),
        document.getElementById("k1"),
        document.getElementById("k2"),

        document.getElementById("tm"),
        document.getElementById("ti"),
        document.getElementById("twa"),
        document.getElementById("twb"),

        document.getElementById("ti1a"),
        document.getElementById("ti1b"),
        document.getElementById("tm1"),

        document.getElementById("ti2a"),
        document.getElementById("ti2b"),
        document.getElementById("tm2"),

        document.getElementById("br")
    ];

    const allGameElements = [
        p1, p2, keygroup1, keygroup2, key1, key2,
        header, round_counter, win_announcement, win_time,
        p1messageA, p1messageB, p1MessageMiss,
        p2messageA, p2messageB, p2MessageMiss,
        play_again_btn
    ]

    const allNotPlayerElements = [
        keygroup1, keygroup2, key1, key2,
        header, round_counter, win_announcement, win_time,
        p1messageA, p1messageB, p1MessageMiss,
        p2messageA, p2messageB, p2MessageMiss,
        play_again_btn
    ]

    const gamestage1Components = [round_counter, p1messageA, p1messageB, keygroup1, p2messageA, p2messageB, keygroup2]
    const gamestage2Components = [header];
    const gamestage3Components = [header, key1, key2];
    const gamestage4Components = [win_announcement, win_time, play_again_btn];

    const gs1p1Components = [p1messageA, p1messageB, keygroup1];
    const gs1p2Components = [p2messageA, p2messageB, keygroup2];

    const [header_child, round_counter_child, win_announcement_child, win_time_child] = 
    [
        document.getElementById("tm_c"),
        document.getElementById("ti_c"),
        document.getElementById("twa_c"),
        document.getElementById("twb_c")
    ];

    const keyGroup1_1 = ['f', 'd', 's', 'r', 'e', 'w'];
    const keyGroup2_1 = ['j', 'k', 'l', 'u', 'i', 'o'];
    const keygroup1_2 = ['f', 'd', 'r', 'e'];
    const keygroup2_2 = ['j', 'k', 'u', 'i'];
    const keygroup1_3 = ['f', 'r'];
    const keygroup2_3 = ['j', 'u'];

    //Audio
    const readyM = new Audio("assets/audio/introv2.mp3");
    const finaleM = new Audio("assets/audio/finalev2.mp3");
    
    const readySE = new Audio("assets/audio/revolvercock1-6924.mp3");
    const readySE2 = new Audio("assets/audio/revolvercock1-6924.mp3");
    const shotSE = new Audio("assets/audio/gun-shot-6178.mp3");
    const shotSE2 = new Audio("assets/audio/gun-shot-6178.mp3");

    const readyVO = new Audio("assets/audio/ready.mp3");
    const drawVO = new Audio("assets/audio/draw.mp3");

    function playAudio(track) {
        track.load();
        track.play();
    }

    //random function
    function rand(max) {
        return Math.floor(Math.random() * max); //SOURCE ATTRIBUTION: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random 
    }
    
    //Player positioning
    const initialOffsetX = 55;
    const initialOffsetY = 110;
    const gapSize = 100;

    function setLevel1() {
        const offsetX = `${initialOffsetX}px`;
        const offsetY = `${initialOffsetY}px`;
        p1.style.left = offsetX;
        p1.style.bottom = offsetY;
        p2.style.right = offsetX;
        p2.style.bottom = offsetY;
        round_counter_child.innerHTML = "Round: 1<br>Distance: 30 Paces";
        keygroup1.src = "assets/keys/keygroup-1-1.png";
        keygroup2.src = "assets/keys/keygroup-2-1.png";
    }

    function setLevel2() {
        const offsetX = `${initialOffsetX+gapSize}px`;
        const offsetY = `${initialOffsetY}px`;
        p1.style.left = offsetX;
        p1.style.bottom = offsetY;
        p2.style.right = offsetX;
        p2.style.bottom = offsetY;
        round_counter_child.innerHTML = "Round: 2<br>Distance: 20 Paces";
        keygroup1.src = "assets/keys/keygroup-1-2.png";
        keygroup2.src = "assets/keys/keygroup-2-2.png";
    }

    function setLevelN(n) {
        const offsetX = `${initialOffsetX+(gapSize*2)}px`;
        const offsetY = `${initialOffsetY}px`;
        p1.style.left = offsetX;
        p1.style.bottom = offsetY;
        p2.style.right = offsetX;
        p2.style.bottom = offsetY;
        round_counter_child.innerHTML = `Round: ${n}<br>Distance: 10 Paces`;
        keygroup1.src = "assets/keys/keygroup-1-3.png";
        keygroup2.src = "assets/keys/keygroup-2-3.png";
    }
    
    //Death animation
    async function p1Dies() {
        const [x, y] = [parseInt(p1.style.left, 10), parseInt(p1.style.bottom, 10)];
        p1.src="assets/player/p1-losing.png";
        p1.style.left = `${x-20}px`;
        p1.style.bottom = `${y+15}px`;
        await sleep(1000);
        p1.src="assets/player/p1-losing-2.png";
        p1.style.transform = "rotate(330deg)";
        p1.style.left = `${x-30}px`;
        p1.style.bottom = `${y+5}px`;
        await sleep(1000);
        p1.style.transform = "rotate(0deg)";
        p1.style.left = `${x-40}px`;
        p1.style.bottom = `${y-20}px`;
        p1.src="assets/player/p1-lose.png";
    }

    async function p2Dies() {
        const [x, y] = [parseInt(p2.style.right, 10), parseInt(p2.style.bottom, 10)];
        p2.src="assets/player/p2-losing.png";
        p2.style.right = `${x-20}px`;
        p2.style.bottom = `${y+15}px`;
        await sleep(1000);
        p2.src="assets/player/p2-losing-2.png";
        p2.style.transform = "rotate(30deg)";
        p2.style.right = `${x-30}px`;
        p2.style.bottom = `${y+5}px`;
        await sleep(1000);
        p2.style.transform = "rotate(0deg)";
        p2.style.right = `${x-40}px`;
        p2.style.bottom = `${y-20}px`;
        p2.src="assets/player/p2-lose.png";
    }

    //sets game window elements
    function setGamestageN(n) {
        hideAllNonPlayerElements();
        let stageComponents = allGameElements;
        switch(n) {
            case 1:
                p1.src = "assets/player/p1-stand.png";
                p2.src = "assets/player/p2-stand.png";
                stageComponents = gamestage1Components;
                break;
            case 2:
                header_child.innerHTML = "READY";
                stageComponents = gamestage2Components;
                break;
            case 3:
                header_child.innerHTML = "DRAW";
                stageComponents = gamestage3Components;
                break;
            case 4:
                stageComponents = gamestage4Components;
                break;
        }
        for(const e of stageComponents) {
            e.style.display = 'block';
        }
    }

    function hideAllElements() {
        for(const e of allGameElements) {
            e.style.display = 'none';
        }
    }

    function showPlayers() {
        p1.style.display = 'block';
        p2.style.display = 'block';
    }

    function hideAllNonPlayerElements() {
        for(const e of allNotPlayerElements) {
            e.style.display = 'none';
        }
    }

    function hidePlayer1Elements() {
        for(const e of gs1p1Components) {
            e.style.display = 'none';
        }
    }

    function hidePlayer2Elements() {
        for(const e of gs1p2Components) {
            e.style.display = 'none';
        }
    }

    //GAME LOOP VARIABLE - DECLARED NOW FOR LISTENER USE
    let gl;

    //key listener and game loop function
    function keyListener(k) {
        gl.next(k.key);
    }

    async function* gameLoop() {
        let i = 1, gameOver = false;
        while(!gameOver) { //1 loop is an interation of a round
            let p1Key = 'f', p2Key = 'j'; //declare keys to match correct input with
            let p1Keygroup = keyGroup1_1, p2Keygroup = keyGroup2_1; //declare keygroup used this round
            let maxKeys = 1; //declare max number of keys
            switch(i) {
                case 1: //round 1 - any of 6 keys
                    maxKeys = 6;
                    setLevel1(); // set player positioning
                    break;
                case 2:
                    maxKeys = 4;
                    p1Keygroup = keygroup1_2; //set correct key group to use
                    p2Keygroup = keygroup2_2;
                    setLevel2();
                    break;
                default:
                    maxKeys = 2;
                    p1Keygroup = keygroup1_3;
                    p2Keygroup = keygroup2_3;
                    setLevelN(i);
            }
            p1Key = p1Keygroup[rand(maxKeys)]; //select each player's key
            p2Key = p2Keygroup[rand(maxKeys)];
            key1.src = `assets/keys/${p1Key}.png`; //set key image
            key2.src = `assets/keys/${p2Key}.png`;
            setGamestageN(1);
            playAudio(readyM);
            let p1Ready = false, p2Ready = false; //initialize each player's ready state
            document.addEventListener("keydown", keyListener); //set key listener
            while(!p1Ready || !p2Ready) { //stage 2 waiting loop
                const key = yield 'gs1'; //wait for input from keyboard
                if(!p1Ready) {
                    if(keyGroup1_1.includes(key)) { //if player 1 key pressed and not ready
                        p1Ready = true; //set ready
                        hidePlayer1Elements();
                        playAudio(readySE);
                    }
                }
                if(!p2Ready) {
                    if(keyGroup2_1.includes(key)) {
                        p2Ready = true;
                        hidePlayer2Elements();
                        playAudio(readySE2);
                    }
                }
            } //loop break - move to game stage 2
            document.removeEventListener('keydown', keyListener); //remove keyboard listener
            let p1Shot = false, p2Shot = false; //initialize game variables: either player has shor, either player has won
            let p1Wins = false, p2Wins = false;
            hideAllNonPlayerElements();
            await sleep(800);
            setGamestageN(2); //set gamestage 2 - ready screen
            playAudio(readyVO);
            await sleep((2000+rand(3000))); //wait 2-5 seconds
            setGamestageN(3); //set gamestage 3 - draw screen
            playAudio(drawVO);
            let time = Date.now(); //get time for measuring reaction 
            document.addEventListener("keydown", keyListener); //reset keyboard listener
            while(!((p1Shot && p2Shot) || (p1Wins || p2Wins))) { //stage 4/reset waiting loop
                const key = yield 'gs3'; //wait for keyboard input
                if(!p1Shot && p1Keygroup.includes(key)) { //if p1 has not shot and key is from their set
                    p1Shot = true; //player has fired - set accordingly
                    playAudio(shotSE);
                    p1.src = p1.src = "assets/player/p1-shoot.png";
                    if(key == p1Key) { //if key pressed is correct
                        p1Wins = true; //p1 wins
                        time = Date.now() - time; //time calculation for player to win
                        document.removeEventListener('keydown', keyListener); //unset key listener
                        hideAllNonPlayerElements();
                        await p2Dies(); //other player loses
                        await sleep(2000); //wait seconds after lose animation
                    } else {
                        key1.style.display = 'none' //otherwise player 1 has missed
                        p1MessageMiss.style.display = 'block';
                    }
                }
                if(!p2Shot && p2Keygroup.includes(key)) {
                    p2Shot = true;
                    playAudio(shotSE2);
                    p2.src = "assets/player/p2-shoot.png";
                    if(key == p2Key) {
                        p2Wins = true;
                        time = Date.now() - time; 
                        document.removeEventListener('keydown', keyListener);
                        hideAllNonPlayerElements();
                        await p1Dies();
                        await sleep(2000);
                    } else {
                        key2.style.display = 'none'
                        p2MessageMiss.style.display = 'block';
                    }
                }
            }
            document.removeEventListener('keydown', keyListener); //remove keyboard listener
            if(p1Wins) { //if player 1 wins
                win_announcement_child.innerHTML = "PLAYER 1 WINS"; //set text fields accordingly
                win_time_child.innerHTML = `Drew in ${(time/1000).toFixed(3)} seconds`;
                setGamestageN(4); //move to gamestage 4
                playAudio(finaleM);
                gameOver = true;
            } else if(p2Wins) {
                win_announcement_child.innerHTML = "PLAYER 2 WINS";
                win_time_child.innerHTML = `Drew in ${(time/1000).toFixed(3)} seconds`;
                setGamestageN(4);
                playAudio(finaleM);
                gameOver = true;
            } else { //if not
                key1.style.display = 'none';
                key2.style.display = 'none';
                await sleep(3000);
                i++;
            }
        }
    }

    /* OLD PSEUDOCODE
        Loop: While Game not over
            Set game window to stage 1
            play stinger sound effect
            wait for players to confirm
            play gunclick sound effect when player readies

            Set game window to stage 2
            play ready voice line
            wait 2-5 seconds

            set game window to stage 3
            start timer
            Loop: while round not over
                await character input
                if player miss loop back
                if player hit
                    round over, break loop
                if both player miss
                    round over, break loop
            
            if both player miss
                set game window back to stage 1
                set player distances using setLevel functions
            
            if player hit
                end timer
                game over, break loop
        
        set game window to stage 4
        set time in win_time accordingly
        */
    //game loop initialization: create new game iteration on click of the "play again" button (appropriated at first as "play" button)

    function nextPlay() {
        gl = gameLoop();
        gl.next();    
    }

    function firstPlay() {
        gl = gameLoop();
        gl.next();
        showPlayers();
        switchPlayFunctions();
    }

    function switchPlayFunctions() {
        play_again_btn.innerHTML = "Play Again";
        play_again_btn.removeEventListener('click', firstPlay);
        play_again_btn.addEventListener('click', nextPlay);
    }

    hideAllElements();
    play_again_btn.style.display = 'block';
    play_again_btn.addEventListener('click', firstPlay);


    /*
    ////////////////////////////////////////////////////////////////
    //DEBUG WINDOW STUFF
    ////////////////////////////////////////////////////////////////
    let open = false;

    const debug_window = document.getElementById("debug-window");

    //function to add events to all of these debug buttons
    function easy(id, f) {
        document.getElementById(id).addEventListener("click", f);
    }

    easy("debug-window-button", ()=>{
        if(open) {
            debug_window.style.display = "none";
        } else {
            debug_window.style.display = "block";
        }
        open = !open;
    });

    document.getElementById("btn-hide-all").addEventListener("click", () => {
        for(const e in allNotPlayerElements) {
            allNotPlayerElements[e].style.display = "none";
        }
    });

    document.getElementById("btn-a-g1").addEventListener("click", ()=> {
        for(const e in gamestage1Components) {
            gamestage1Components[e].style.display = "block";
        }
    });

    document.getElementById("btn-a-g2").addEventListener("click", ()=> {
        for(const e in gamestage2Components) {
            header_child.innerHTML = "READY"
            gamestage2Components[e].style.display = "block";
        }
    });

    document.getElementById("btn-a-g3").addEventListener("click", ()=> {
        for(const e in gamestage3Components) {
            header_child.innerHTML = "DRAW";
            gamestage3Components[e].style.display = "block";
        }
    });

    document.getElementById("btn-a-g4").addEventListener("click", ()=> {
        for(const e in gamestage4Components) {
            gamestage4Components[e].style.display = "block";
        }
    });

    easy("btn-a-pos1", setLevel1);

    easy("btn-a-pos2", setLevel2);

    easy("btn-a-pos3", ()=>{setLevelN(3)});

    easy("btn-p1-miss", ()=>{
        p1MessageMiss.style.display = "block";
    });

    //PLAYER 1
    easy("btn-p1-sprite-1", ()=>{
        p1.src = "assets/player/p1-stand.png";
    });

    easy("btn-p1-sprite-2", ()=>{
        p1.src = "assets/player/p1-shoot.png";
    });

    easy("btn-p1-keygroup-1", ()=>{
        keygroup1.src = "assets/keys/keygroup-1-1.png";
    });

    easy("btn-p1-keygroup-2", ()=>{
        keygroup1.src = "assets/keys/keygroup-1-2.png";
    });

    easy("btn-p1-keygroup-3", ()=>{
        keygroup1.src = "assets/keys/keygroup-1-3.png";
    });

    easy("btn-p1-key-1", ()=>{
        key1.src= "assets/keys/f.png";
    });

    easy("btn-p1-key-2", ()=>{
        key1.src= "assets/keys/d.png";
    });

    easy("btn-p1-key-3", ()=>{
        key1.src= "assets/keys/s.png";
    });

    easy("btn-p1-key-4", ()=>{
        key1.src= "assets/keys/r.png";
    });

    easy("btn-p1-key-5", ()=>{
        key1.src= "assets/keys/e.png";
    });

    easy("btn-p1-key-6", ()=>{
        key1.src= "assets/keys/w.png";
    });

    easy("btn-p1-die", p1Dies);

    //PLAYER 2
    easy("btn-p2-miss", ()=>{
        p2MessageMiss.style.display = "block";
    });

    easy("btn-p2-sprite-1", ()=>{
        p2.src = "assets/player/p2-stand.png";
    });

    easy("btn-p2-sprite-2", ()=>{
        p2.src = "assets/player/p2-shoot.png";
    });

    easy("btn-p2-keygroup-1", ()=>{
        keygroup2.src = "assets/keys/keygroup-2-1.png";
    });

    easy("btn-p2-keygroup-2", ()=>{
        keygroup2.src = "assets/keys/keygroup-2-2.png";
    });

    easy("btn-p2-keygroup-3", ()=>{
        keygroup2.src = "assets/keys/keygroup-2-3.png";
    });

    easy("btn-p2-key-1", ()=>{
        key2.src= "assets/keys/j.png";
    });

    easy("btn-p2-key-2", ()=>{
        key2.src= "assets/keys/k.png";
    });

    easy("btn-p2-key-3", ()=>{
        key2.src= "assets/keys/l.png";
    });

    easy("btn-p2-key-4", ()=>{
        key2.src= "assets/keys/u.png";
    });

    easy("btn-p2-key-5", ()=>{
        key2.src= "assets/keys/i.png";
    });

    easy("btn-p2-key-6", ()=>{
        key2.src= "assets/keys/o.png";
    });

    easy("btn-p2-die", p2Dies);

    //AUDIO TRACKS
    easy("btn-aud-m1", ()=>{
        introM.load();
        introM.play();
    });

    easy("btn-aud-m2", ()=>{
        stingerM.load();
        stingerM.play();
    });

    easy("btn-aud-se1", ()=>{
        readySE.load();
        readySE.play();
    });

    easy("btn-aud-se2", ()=>{
        shotSE.load();
        shotSE.play();
    });

    easy("btn-aud-vo1", ()=>{
        readyVO.load();
        readyVO.play();
    });

    easy("btn-aud-vo2", ()=>{
        drawVO.load();
        drawVO.play();
    });

    easy("btn-aud-vo3", ()=>{
        p1VO.load();
        p1VO.play();
    });

    easy("btn-aud-vo4", ()=>{
        p2VO.load();
        p2VO.play();
    });

    setLevel1();
    */
});

