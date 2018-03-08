(()=>{
  var d=document
  ,sc=d.querySelector("#mCSB_1")
  ,p= sc.parentNode
  ,c= d.querySelector("#mCSB_1_container")
  p.appendChild(c)
  sc.remove();
  p.setAttribute("class","")
  p.style.maxHeight = "none"
})()
