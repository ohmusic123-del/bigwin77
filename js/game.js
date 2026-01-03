let time=30,roundId=Date.now()+"";
setInterval(()=>{
  timer.innerText="00:"+String(time--).padStart(2,"0");
  if(time<0){time=30;apiPost("/round/resolve",{roundId});roundId=Date.now()+"";}
},1000);

function bet(color){
  apiPost("/bet",{color,amount:1,roundId},localStorage.token);
}
