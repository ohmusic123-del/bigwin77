apiGet("/wallet",localStorage.token).then(r=>{
  bal.innerText="₹"+r.wallet;
});
