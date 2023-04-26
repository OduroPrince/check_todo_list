console.log("I'm here")

var links = document.querySelectorAll('.sidenav a');

    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            links.forEach(function (link) {
                link.classList.remove('active');
            });
            event.target.classList.add('active');
            
            var linkName = event.target.textContent;
            // alert('You clicked ' + linkName);
            // console.log(linkName);
            if(linkName == "Home"){
              document.querySelector(".main").style.display = "grid";
              document.querySelector(".important-list").style.display = "none";
              document.querySelector(".category-list").style.display = "none";
              document.querySelector(".collaborations").style.display = "none";
            }else if(linkName == 'Important'){
              document.querySelector(".main").style.display = "none";
              document.querySelector(".important-list").style.display = "block";
              document.querySelector(".category-list").style.display = "none";
              document.querySelector(".collaborations").style.display = "none";
            }else if(linkName == "Category"){
              document.querySelector(".main").style.display = "none";
              document.querySelector(".important-list").style.display = "none";
              document.querySelector(".category-list").style.display = "block";
              document.querySelector(".collaborations").style.display = "none";
            }else if(linkName == "Collaborations"){
              document.querySelector(".main").style.display = "none";
              document.querySelector(".important-list").style.display = "none";
              document.querySelector(".category-list").style.display = "none";
              document.querySelector(".collaborations").style.display = "block";
            }
        });
    });

