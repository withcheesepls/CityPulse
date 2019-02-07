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
    let linePoints = makeLinePoints(boxHeight, boxWidth, 5, 7, 10);
    drawLines(linePoints, $box, 'line-secondary');
    let mainLine = makeLinePoints(boxHeight, boxWidth, 1, 7, 15);
    drawLines(mainLine, $box, 'line-main');
  }

  function drawLines(linePoints, $box, lineClass){
    for(let ps in linePoints){
      prevPoint = [];
      let path = $('<div class="path"></div>');
      for(let p in linePoints[ps]){
        let line = '';
        if(linePoints[ps][p][2] == 'beginning'){
          line = $(`<div class="line-start"></div>`);
          line.offset({top: linePoints[ps][p][0], left: linePoints[ps][p][1]});
        }
        else if(linePoints[ps][p][2] == 'up'){
          let height = prevPoint[0] - linePoints[ps][p][0];
          line = $(`<div class="line ${lineClass} up" style="width:1px; height: ${height}px"></div>`)
          line.offset({top: linePoints[ps][p][0] , left: linePoints[ps][p][1]});
        }
        else if(linePoints[ps][p][2] == 'right'){
          let width = linePoints[ps][p][1] - prevPoint[1];
          line = $(`<div class="line ${lineClass} right" style="width:${width}px; height: 1px"></div>`)
          line.offset({top: prevPoint[0], left: prevPoint[1]});
        }
        else if(linePoints[ps][p][2] == 'down'){
          let height = linePoints[ps][p][0] - prevPoint[0];
          line = $(`<div class="line ${lineClass} down" style="width:1px; height: ${height}px"></div>`)
          line.offset({top: prevPoint[0], left: prevPoint[1]});
        }
        else if(linePoints[ps][p][2] == 'left'){
          let width = prevPoint[1] - linePoints[ps][p][1];
          line = $(`<div class="line ${lineClass} left" style="width:${width}px; height: 1px"></div>`)
          line.offset({top: linePoints[ps][p][0], left: linePoints[ps][p][1]});
        }
        prevPoint = linePoints[ps][p];
        path.append(line);
      }
      $box.append(path);
    }
  }

  // this function returns an array of array points represnting the lines
  function makeLinePoints(height, width, amount, amountMinTurns, amountMaxTurns){
    let linePoints = [];
    for(let i = 0; i < amount; i++){
      let amountLines = getRandomInt(amountMinTurns, amountMaxTurns);
      let singlePath = [];
      let prevPoint = null;
      let prevDir = null;
      for(let j = 0; j < amountLines; j++){
        let turnProb = Math.random();
        let position = [];
        let change = false;
        let mainProb = .5;
        let upProb = .5;
        let leftProb = .5;
        // for the lines to be straight they must turn left, right, up, or down.(and not back)
        if(!prevDir) {
          position = [getRandomArbitrary(0, height), getRandomArbitrary(0, width), 'beginning'];
          prevDir = 'beginning';
          change=true;
        }
        else if(turnProb < mainProb && (prevDir != 'up' && prevDir != 'down')){
          if(Math.random() < upProb && prevDir != 'up'){
            position = [getRandomArbitrary(0, prevPoint[0]), prevPoint[1], 'up'];
            prevDir = 'up';
            change=true;
            upProb =.7;
          }
          else if(prevDir != 'down'){
            position = [getRandomArbitrary(prevPoint[0], height), prevPoint[1], 'down'];
            prevDir = 'down';
            change=true;
            upProb = .2;
          }
          // mainProb = .7;
        }
        else if(prevDir != 'left' && prevDir != 'right'){
          if(Math.random() < leftProb && prevDir != 'left'){
            position = [prevPoint[0], getRandomArbitrary(0, prevPoint[1]), 'left'];
            prevDir = 'left';
            change=true;
            leftProb = .7;
          }
          else if(prevDir != 'right'){
            position = [prevPoint[0], getRandomArbitrary(prevPoint[1], width), 'right'];
            prevDir = 'right';
            change=true;
            leftProb = .2;
          }
        }
        if(change){
          prevPoint = position;
          singlePath.push(position);
        }
        else j-=1;
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
