// solution code
function solve(input) {

  s ="";
    
  greeting = input.toUpperCase();
  
  if (greeting == "HOLA"){
    s+= ("SPANISH");
  }
  else if (greeting == "HALLO"){
    s+= ("GERMAN");
  }
  else if (greeting == "HELLO"){
    s+= ("ENGLISH")
  }
  else if (greeting == "BONJOUR"){
    s+= ("FRENCH")
  }
  else if (greeting == "CIAO"){
    s+= ("ITALIAN")
  }
  else if (greeting =="ZDRAVSTUJTE"){
    s+= ("RUSSIAN")
  }
  else{
    s+= ("I don't understand!")
  }

  return s;
}


module.exports = solve;