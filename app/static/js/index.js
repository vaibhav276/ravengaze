'use strict';

var properties = {
   videoBox : {
      x: 0,
      y: 0,
      width: 0,
      height: 0
   },
   canvasBox : {
      x: 0,
      y: 0,
      width: 0,
      height: 0
   }
};

var prediction = {
   x: 0,
   y: 0
};
var canvas = $('#fullPageCanvas').get(0);

function init() {
   initDimensions();
   initCanvasBox();
   startWebGazer();
   checkIfReady();
}

function initDimensions() {
   properties.videoBox.width = 320;
   properties.videoBox.height = 240;
   properties.canvasBox.width = $(window).width() - 2;
   properties.canvasBox.height = $(window).height() - 2;
   console.debug('initDimensions done');
}

function updatePrediction(x, y) {
   prediction.x = x;
   prediction.y = y;
	drawPrediction(prediction.x, prediction.y);
}

function drawPrediction(x, y) {
   if(canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle  = 'rgba(0,0,20,10)';
		ctx.globalCompositeOperation = 'destination-over';
		ctx.clearRect(0,0,properties.canvasBox.width,properties.canvasBox.height);
      ctx.fillRect(x,y,20,20);
	}
	requestAnimFrame(drawPrediction);
}

function initCanvasBox() {
   if(canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.canvas.width = properties.canvasBox.width;
      ctx.canvas.height = properties.canvasBox.height;
   } else {
      console.error('Unable to initialize canvas');
   }
   console.debug('initCanvasBox done');
}

function startWebGazer() {
   webgazer.setRegression('ridge') /* currently must set regression and tracker */
		.setTracker('clmtrackr')
		.setGazeListener(function(data, clock) {
			// console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
			// console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
			if(data && data.x > 0 && data.y > 0) {
				updatePrediction(data.x, data.y);
			}
		})
	.begin()
	.showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */
   console.debug('startWebGazer done');
}

var setup = function() {
   var video = document.getElementById('webgazerVideoFeed');
   video.style.display = 'block';
   video.style.position = 'absolute';
   video.style.top = properties.videoBox.x;
   video.style.left = properties.videoBox.y;
   video.width = properties.videoBox.width;
   video.height = properties.videoBox.height;
   video.style.margin = '0px';

   webgazer.params.imgWidth = properties.videoBox.width;
   webgazer.params.imgHeight = properties.videoBox.height;

   var overlay = document.createElement('canvas');
   overlay.id = 'overlay';
   overlay.style.position = 'absolute';
   overlay.width = properties.videoBox.width;
   overlay.height = properties.videoBox.height;
   overlay.style.top = properties.videoBox.x;
   overlay.style.left = properties.videoBox.y;
   overlay.style.margin = '0px';

   document.body.appendChild(overlay);

   var cl = webgazer.getTracker().clm;

   function drawLoop() {
      requestAnimFrame(drawLoop);
      overlay.getContext('2d').clearRect(0,0,properties.videoBox.width,properties.videoBox.height);
      if (cl.getCurrentPosition()) {
         cl.draw(overlay);
      }
   }
   drawLoop();

   console.debug('setup done');
};

function checkIfReady() {
   console.debug('checkIfReady begin');
   if (webgazer.isReady()) {
      setup();
		$('#webgazerVideoFeed').hide();
   } else {
      setTimeout(checkIfReady, 1000);
   }
}
// setTimeout(checkIfReady,100);


window.onload = function() {
    init();

   /*
	 function drawIndicator() {
		$("#coordinatesDiv").html("x = " + globalX + ", y = " + globalY);
		
		 if (canvas.getContext) {
			 var ctx = canvas.getContext("2d");
			ctx.globalCompositeOperation = 'destination-over';
			 ctx.clearRect(0,0,screenWidth,screenHeight);
			 ctx.fillStyle = "rgba(200,0,0,0.5)";
			 // ctx.fillRect (Math.floor(globalX*ratioX), Math.floor(globalY*ratioY), 10 , 10);
			 ctx.fillRect (globalX, globalY, 10 , 10);
		 }
		 requestAnimFrame(drawIndicator);
	 }
	 requestAnimFrame(drawIndicator)
    */
};


window.onbeforeunload = function() {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions 
}

