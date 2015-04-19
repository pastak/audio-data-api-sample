$(function(){
  var playSound = function(freq){
    if(nowPlay === 0){
      osc.start(0);
      nowPlay = 1;
    }
    var freq = freq;
    if(typeof freq != 'number'){
      freq = parseFloat(document.getElementById("printFreq").value);
    }else{
      document.getElementById("printFreq").value = freq;
    }
    osc.type = $('.wavetype:checked').val();
    var level = parseFloat(document.getElementById("level").value);
    osc.frequency.value = freq;
    gain.gain.value = level;
  };
  var createKeyDOM = function(option){
    var key = $('<div class="key">');
    keyCode = option.keyCode;
    jpName = option.jpName;
    keyPosition += 17;
    key.css({left: keyPosition+'px'});
    if(option.black){
      keyPosition -= 6;
      key.addClass('black');
      keyCode = ''
      jpName = ''
      key.css({left: keyPosition+'px'});
      keyPosition -= 11;
    }
    key.html(keyCode+"<br />"+jpName);
    key.on('click', (function(index){
      return function(){
        playSound( 440 * Math.pow(2,(index - 40)/12) )
      }
    })(option.index))
    return key;
  }

  var audioctx = new AudioContext();
  var osc = audioctx.createOscillator();
  var gain = audioctx.createGain();
  var nowPlay = 0;
  var keyPosition = -10;
  osc.connect(gain);
  gain.connect(audioctx.destination);
  $('#level').on('change', playSound);
  $('.wavetype').on('click',playSound);

  //create Piano Keyboads
  var soundName = ['ド','レ','ミ','ファ','ソ','ラ','シ']
  for(var index = 0; index < 72; index++){
    var key = $('<div class="key">');
    var keyCode = String.fromCharCode(((index+2)%7+65));
    var jpName = soundName[(index+7)%7];
    $('#piano').append(createKeyDOM({
      keyCode: keyCode,
      jpName: jpName,
      index: index
    }))
    switch(keyCode){
      case "A":
      case "C":
      case "D":
      case "F":
      case "G":
      $('#piano').append(createKeyDOM({
        keyCode: keyCode,
        jpName: jpName,
        index: (index+1),
        black: true
      }))
    }
  }

})
