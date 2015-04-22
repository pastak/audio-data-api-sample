$(function(){
  var playSound = function(freq){
    var freq = freq;
    if(typeof freq != 'number'){
      freq = parseFloat(document.getElementById("printFreq").value);
    }else{
      document.getElementById("printFreq").value = freq;
    }

    osc.type = $('.wavetype:checked').val();
    var level = parseFloat(document.getElementById("level").value);
    var steps = Number(document.getElementById("step").value)
    osc.frequency.value = freq;
    gain.gain.value = level;
    var curve = new Float32Array(4096);
    for(var i = 0; i < 4096; ++i) {
      curve[i] = (((i/4096) * steps)|0)/(steps-1)*2-1;
    }
    shaper.curve = curve;
    if(nowPlay === 0){
      osc.start(0);
      nowPlay = 1;
    }
  };
  var pauseSound = function(){
    gain.gain.value = 0.0;
  }
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
    key.on('mousedown', (function(index){

      return function(event){
        event.stopPropagation();
        playSound( 440 * Math.pow(2,(index - 40)/12) )
      }
    })(option.index))
    key.on('mouseup', (function(index){
      return function(){
        pauseSound()
      }
    })(option.index))
    return key;
  }

  var audioctx = new AudioContext();
  var osc = audioctx.createOscillator();
  var gain = audioctx.createGain();
  var shaper = audioctx.createWaveShaper();
  var nowPlay = 0;
  var keyPosition = -10;
  osc.connect(gain);
  gain.connect(shaper);
  shaper.connect(audioctx.destination);

  //create Piano Keyboads
  var soundName = ['ド','レ','ミ','ファ','ソ','ラ','シ']
  for(var i = 0, nameIndex = 0; i < 115; i++, nameIndex++){
    var key = $('<div class="key">');
    var keyCode = String.fromCharCode(((nameIndex+5)%7+65));
    var jpName = soundName[(nameIndex+3)%7];
    $('#piano').append(createKeyDOM({
      keyCode: keyCode,
      jpName: jpName,
      index: i
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
        index: (++i),
        black: true
      }))
    }
  }

})
