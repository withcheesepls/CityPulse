$(document).ready(function(){

  main();

  function main(){
    let $box = $('.main-wrapper .box');
    let offset = $box.offset();
    let topleft = [offset.top, offset.left];
    let bottomleft = [$box.height()+offset.top, $box.width()+offset.left];
    let boxHeight = $box.height();
    let boxWidth = $box.width();
    let points = makePoints(boxHeight, boxWidth, 15);
    drawPoints(points, $box);
    let linePoints = makeLinePoints(boxHeight, boxWidth, 7, 10);
    drawLines(linePoints, $box);
  }

  function drawLines(linePoints, $box){
    for(let ps in linePoints){
      console.table(linePoints[ps]);
      prevPoint = [];
      for(let p in linePoints[ps]){
        let line = '';
        if(linePoints[ps][p][2] == 'beginning'){
          line = $(`<div class="line-start"></div>`);
          line.offset({top: linePoints[ps][p][0], left: linePoints[ps][p][1]});
        }
        else if(linePoints[ps][p][2] == 'up'){
          let height = prevPoint[0] - linePoints[ps][p][0];
          line = $(`<div class="line line-secondary up" style="width:1px; height: ${height}px"></div>`)
          line.offset({top: linePoints[ps][p][0] , left: linePoints[ps][p][1]});
        }
        else if(linePoints[ps][p][2] == 'right'){
          let width = linePoints[ps][p][1] - prevPoint[1];
          line = $(`<div class="line line-secondary right" style="width:${width}px; height: 1px"></div>`)
          line.offset({top: prevPoint[0], left: prevPoint[1]});
        }
        else if(linePoints[ps][p][2] == 'down'){
          let height = linePoints[ps][p][0] - prevPoint[0];
          line = $(`<div class="line line-secondary down" style="width:1px; height: ${height}px"></div>`)
          line.offset({top: prevPoint[0], left: prevPoint[1]});
        }
        else if(linePoints[ps][p][2] == 'left'){
          let width = prevPoint[1] - linePoints[ps][p][1];
          line = $(`<div class="line line-secondary left" style="width:${width}px; height: 1px"></div>`)
          line.offset({top: linePoints[ps][p][0], left: linePoints[ps][p][1]});
        }
        prevPoint = linePoints[ps][p];
        let path = $('<div class="path"></div>');
        path.append(line);
        $box.append(path);
      }
    }
  }

  // this function returns an array of array points represnting the lines
  function makeLinePoints(height, width, amount, amountMaxTurns){
    let linePoints = [];
    for(let i = 0; i < amount; i++){
      let amountLines = getRandomInt(1, amountMaxTurns);
      let singlePath = [];
      let prevPoint = null;
      let prevDir = null;
      for(let j = 0; j < amountLines; j++){
        let turnProb = Math.random();
        let position = [];
        // for the lines to be straight they must turn left, right, up, or down.(and not back)
        if(!prevDir) {
          position = [getRandomArbitrary(0, height), getRandomArbitrary(0, width), 'beginning'];
          prevDir = 'beginning';
        }
        else if(prevDir != 'up' && turnProb < .25){
          console.log('random up', prevPoint[0]);
          position = [getRandomArbitrary(0, prevPoint[0]), prevPoint[1], 'up'];
          prevDir = 'up';
        }
        else if(prevDir != 'right' && turnProb < .5){
          position = [prevPoint[0], getRandomArbitrary(prevPoint[1], width), 'right'];
          prevDir = 'right';
        }
        else if(prevDir != 'down' && turnProb < .75){
          position = [getRandomArbitrary(prevPoint[0], height), prevPoint[1], 'down'];
          prevDir = 'down';
        }
        else if(prevDir != 'left' && turnProb < 1){
          position = [prevPoint[0], getRandomArbitrary(0, prevPoint[1]), 'left'];
          prevDir = 'left';
        }
        prevPoint = position;
        singlePath.push(position);
      }
      linePoints.push(singlePath);
    }
    return linePoints;
  }

  function drawPoints(points, $box){
    for(let p in points){
      let singlePoint = $('<div class="point"></div>');
      singlePoint.offset({top: points[p][0], left: points[p][1]});
      $box.append(singlePoint);
    }
  }

  // return random array of points inside box area
  function makePoints(height, width, amount){
    let points = [];
    for(let i = 0; i < amount; i++){
      points.push(
        [getRandomArbitrary(0, height),
        getRandomArbitrary(0, width)]
      );
    }
    return points;

  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
});
