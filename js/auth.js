function login(){
  apiPost("/login",{
    mobile:mobile.value,
    password:password.value
  }).then(r=>{
    localStorage.setItem("token",r.token);
    location.href="home.html";
  });
}
