window.onload = function(){

    getCountries();
    getDestinations();
    dohvatiPromo();
    ocistiLs();
    document.querySelector("#sort").addEventListener("change",prepSort);
    document.querySelector("#prevoz").addEventListener("change",filterPrevoz);
    document.querySelector("#posalji").addEventListener("click",forma);
    document.querySelector("#destinacija").addEventListener("change",forma);
    document.querySelector("#brOsoba").addEventListener("change",forma);
    document.querySelector("#datumOd").addEventListener("change",forma);
    document.querySelector("#name").addEventListener("blur",forma);
    document.querySelector("#email").addEventListener("blur",forma);
}

function ocistiLs () {

    localStorage.clear()
  }




function getCountries(){
    $.ajax({
        url:"assets/data/countries.json",
        method:"get",
        type:"json",
        success:function(countries){
            setCountries(countries);
            
        }

    })
}
var nizDest = [];
function getDestinations(){
    $.ajax({
        url:"assets/data/destinations.json",
        method:"get",
        type:"json",
        success:function(destinations){
            setDestinations(destinations);
            nizDest = destinations;
            fillOptionDest(nizDest);
            
        }

    })
}
var krit;
function prepSort(){
    krit= document.querySelector("#sort").value;
    addLocalS("cena",krit);
    sortitaj(krit,nizDest);
}


function setCountries(countries){
    let html=`<a href="#" class="country" data-countryId="0"><img class="drzava" src="assets/images/all.jpg"/></a>
    `;

    for(c of countries){
        html+=`
        <a href="#" class="country" data-countryId="${c.id}"><img class="drzava" src="${c.image}"/></a>
        `
    }
    document.querySelector("#countries").innerHTML+=html;

    var zemlje = document.getElementsByClassName("country");
   
    for(let j=0;j<zemlje.length;j++){
    zemlje[j].addEventListener("click",filterZemljePrep);
}
  
}
function filterZemljePrep(e){
    e.preventDefault();
    let selectedId=this.dataset.countryid;

    addLocalS("zemlja",selectedId);
    filtriraj(selectedId);
   

}

function setDestinations(destinations){
        var privrNiz=[];
        if(localStorage.getItem("zemlja")){
            let zemlja = localStorage.getItem("zemlja");

            if(zemlja != 0 ){
                privrNiz = destinations.filter(x=> x.country.id ==zemlja);

                destinations = privrNiz;
            }
           
        
            
        }
        if(localStorage.getItem("cena")){
            let cena = localStorage.getItem("cena");
            if(cena == "PriceLtoH"){
                destinations.sort(function(a,b){
                     if(a.price<b.price){
                         return -1;
                     }
                     if(a.price>b.price){
                         return 1;
                     }
                     if(a.price == b.price){
                         return 0;
                     }
                 })
                 
                
            }
 
            if(cena == "PriceHtoL"){
             destinations.sort(function(a,b){
                  if(a.price>b.price){
                      return -1;
                  }
                  if(a.price<b.price){
                      return 1;
                  }
                  if(a.price == b.price){
                      return 0;
                  }
              })
             
             
         }
        

        }

        if(localStorage.getItem("prevoz")){
            let prevoz = localStorage.getItem("prevoz");
            if(prevoz != -1){

                privrNiz = destinations.filter(x=> x.prevoz == prevoz);
            }

        }

    let html=`<div class="row">`;
    if(destinations.length !=0){
        for(d of destinations){
            let i=0;
            
            html+=`
            <div class="col-md-4">
            <div class="mu-featured-tours-single">
                <img src="assets/images/${d.coverImg}" alt="img">
                <div class="mu-featured-tours-single-info">
                    <h3>${d.name} ${prevozIkonica(d.prevoz)}</h3>
                    <h4> ${d.noNights} Nights</h4>
                    <span class="mu-price-tag">&euro; ${d.price} </span>
                    <p>${d.desc}</p>
                    <a href="#mu-contact" data-id="${d.id}"  class="mu-book-now-btn bookDest">Book Now</a>
                </div>
            </div>
        </div>
            `
        }
    
        function prevozIkonica(prevoz){
            if(prevoz == "Avion"){
                return  `<i class="fas fa-plane"></i>`
            }
            else{
                return ` <i class="fas fa-bus"></i>`
            }
        }
    
        html+=`</div>`;
        
        document.querySelector("#destinacije").innerHTML=html;
    


    }
   else{
    document.querySelector("#destinacije").innerHTML=`<h2>There is no destianion in our agency with your filter specifactions</h2>`;
   }

}

function filterPrevoz(destinations){
    let prevoz=document.querySelector("#prevoz").value;
    addLocalS("prevoz",prevoz);
    $.ajax({
        url:"assets/data/destinations.json",
        method:"get",
        type:"json",
        success:function(destinations){
            
           prevoz != -1 ? destinations = destinations.filter(d => d.prevoz == prevoz) : setDestinations(destinations);
            setDestinations(destinations);

        }

    })
    
    
}

function sortitaj(krit,destinations){
    
   
            
           if(krit == "PriceLtoH"){
               destinations.sort(function(a,b){
                    if(a.price<b.price){
                        return -1;
                    }
                    if(a.price>b.price){
                        return 1;
                    }
                    if(a.price == b.price){
                        return 0;
                    }
                })
                setDestinations(destinations);
               
           }

           if(krit == "PriceHtoL"){
            destinations.sort(function(a,b){
                 if(a.price>b.price){
                     return -1;
                 }
                 if(a.price<b.price){
                     return 1;
                 }
                 if(a.price == b.price){
                     return 0;
                 }
             })
             setDestinations(destinations);
            
        }
        else{
            setDestinations(destinations);
        }
           
        }





function dohvatiPromo () {
    $.ajax({
        url:"assets/data/promos.json",
        method:"get",
        type:"json",
        success:function(promo){
            ispisPromo(promo);
        }

    })
    function ispisPromo(promo){
        let html="";
        for(p of promo){
            html+=`
            <div class="col-md-4">
            <div class="mu-why-us-single">
                <div class="my-why-us-single-icon">
                    <i class="fa fa-${p.icon}" aria-hidden="true"></i>
                </div>
                <h3>${p.name}<h3>
                <p>${p.desc}</p>
            </div>
             </div>
            
            `
        }
        document.querySelector("#promo").innerHTML= html;
    }
  }

  
function filtriraj(idZemlje){
    $.ajax({
        url:"assets/data/destinations.json",
        method:"get",
        type:"json",
        success:function(destinations){

            if(idZemlje != "0"){
                destinations = destinations.filter(d => d.country.id == idZemlje);
            }
            
            setDestinations(destinations);
        }

    })
}

function fillOptionDest(nizDest){
    let html=`<option value="0">Choose Destination</option>`;

    for(d of nizDest){
        html+= `
        <option value="${d.id}">${d.name}</option>
        `
    }
    document.querySelector("#destinacija").innerHTML = html;
}

var OsobeMax = 8;

function brOsoba(maxBrOsoba){
    let html="";
    for(let i=1 ; i< maxBrOsoba+1; i++){
         html+=`
         <option value="${i}">${i}</option>
         `
    }
    document.querySelector("#brOsoba").innerHTML= html;
}

brOsoba(OsobeMax);




//regexp za formu
//fja za racunanje cene na osovnu desinacije i broja osoba
//fja za dodavanje datuma u polje datum vracanja


function forma(){

   

    let ime = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let dest = document.querySelector("#destinacija").value;
    let brOsoba = document.querySelector("#brOsoba").value;
    let datumPolazak = document.querySelector("#datumOd").value;
    
    if(dest != "0"){
        document.querySelector("#greskaDest").innerHTML = "";
    }
    else{
        document.querySelector("#greskaDest").innerHTML = "* You must choose destination ";
    }
    regName=/(^[A-Z][A-z\s]*)$/;
    regMail = /^[A-z\.\_\-\d]{4,20}@[A-z\.\_\-]{4,20}$/;
  
    if(regName.test(ime) && ime != ""){
        document.querySelector("#greskaName").innerHTML = "";
    }
    else{
        document.querySelector("#greskaName").innerHTML = "* Name and surname are required</br>(exp : John Smith)";
    }

    if(regMail.test(email) && email != ""){
        document.querySelector("#greskaMail").innerHTML = "";
    }
    else{
        document.querySelector("#greskaMail").innerHTML = "* Email is required </br>(exp : john@gmail.com)";
    }

    function findDestPrice(dest){
        
        let cena = nizDest.filter(x => x.id == dest).map(x => x.price);
        
        return cena;
    }
    function findDestDuration(dest){
        let brDana = nizDest.filter(x => x.id == dest).map(x => x.noNights);
        return brDana;
        
    }


    function racunajCenu(cena,brOsoba){
        return cena*brOsoba;
    }
    function popniDatum(datumOd,brDana){
        if(dest == 0){
            return false;
        }

        let trenutniDatum = new Date();
        let trenutniTimeStamp = new Date(trenutniDatum);

        let timestamp = new Date(datumOd).getTime();
        if(timestamp < trenutniDatum){
            document.querySelector("#greskaDate").innerHTML =" <p class='red'>*You must choose date in future !</p>";
        }
        else{
            document.querySelector("#greskaDate").innerHTML ="";
        }
        
        let endTimestamp = timestamp +(brDana*86400*1000);
       
        let datumVracanja = new Date(endTimestamp);
        
        let dateForInput = `${datumVracanja.getFullYear() }-${('0' + (datumVracanja.getMonth() + 1)).slice(-2)}-${('0' + datumVracanja.getDate()).slice(-2)}`;
        
        document.querySelector("#datumDo").value=dateForInput;

        
    }
    
    popniDatum(datumPolazak,findDestDuration(dest));



    findDestPrice(dest); // ovo ide kad prodje provera za dest

    function ispisCene(){
        
    let ispisCena=racunajCenu(findDestPrice(dest),brOsoba);
    document.querySelector("#cena").innerHTML = `${ispisCena}&euro;`;
    }

    ispisCene();
    
}



function addLocalS(name,vrednost){

    localStorage.setItem(name, vrednost);
   
  
}

