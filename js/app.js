const overlay = document.querySelector(".overlay");
const employeesHTML = document.querySelector(".main-container");
const searchInput = document.querySelector("input");
let employeeData = {};

// get employee data
$.ajax({
  url: "https://randomuser.me/api/?results=12&nat=us&inc=picture,name,email,location,cell,dob,login",
  dataType: "json",
  success: function (response) {
    employeeData = response.results;
    filteredEmployeeData = employeeData;
    cards.render();
  }
});

// return uppercased word/words
function uppercase(string) {
  let array = string.split(" ");
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].charAt(0).toUpperCase() + array[i].slice(1);
  }
  return array.join(" ");
}

// modal methods
const modal = {
  position: 0,
  render: function (index) {
    modal.position = index;

    let dob = function () {
      let dob = employeeData[index].dob.split(" ");
      let array = dob[0].split("-");
      let temp = array.shift();
      array.push(temp);
      return array.join("/");
    };
    let employeeHTML = "";
    employeeHTML += '<div class="modal">';
    employeeHTML += '<span class="close"> &times;</span>';
    employeeHTML += '<span class="arrow arrow-right"> &rarr; </span>';
    employeeHTML += '<span class="arrow arrow-left"> &larr; </span>';
    employeeHTML += '<img src="' + employeeData[index].picture.large + '">';
    employeeHTML += "<ul>";
    employeeHTML +=
      "<li>" +
      uppercase(employeeData[index].name.first) +
      " " +
      uppercase(employeeData[index].name.last) +
      "</li>";
    employeeHTML += "<li>" + employeeData[index].email + "</li>";
    employeeHTML +=
      "<li>" + uppercase(employeeData[index].location.city) + "</li>";
    employeeHTML += "<hr>";
    employeeHTML += "<li>" + employeeData[index].cell + "</li>";
    employeeHTML +=
      "<li>" +
      uppercase(employeeData[index].location.street) +
      ", " +
      uppercase(employeeData[index].location.state) +
      " " +
      employeeData[index].location.postcode +
      "</li>";
    employeeHTML += "<li>" + "Birthday: " + dob() + "</li>";
    employeeHTML += "</ul>";


    employeeHTML += "</div>";
    overlay.style.display = "flex";
    $(".overlay").html(employeeHTML);
    modal.setUpEventListeners();
  },
  next: function () {
    if (modal.position === employeeData.length - 1) {
      modal.position = 0;
    } else {
      modal.position++;
    }


    if (employeeData[modal.position].render || typeof employeeData[modal.position].render === "undefined") {
      modal.render(modal.position);
    } else {
      modal.render(find(modal.position));
    }

  },
  previous: function () {
    if (modal.position === 0) {
      modal.position = employeeData.length - 1;
    } else {
      modal.position--;
    }
    // if (employeeData[modal.position].render || typeof employeeData[modal.position].render === "undefined") {
    //   modal.render(modal.position);
    // } else {
    //   modal.render(find(modal.position));
    // }
  },
  setUpEventListeners: function () {
    document.querySelector(".close").addEventListener("click", function () {
      document.querySelector('body').style.overflow = "scroll";
      overlay.style.display = "none";
    });
    document.querySelector(".close").addEventListener("mouseover", function () {
      document.querySelector(".modal").style.opacity = ".7";
    });
    document.querySelector(".close").addEventListener("mouseout", function () {
      document.querySelector(".modal").style.opacity = "1";
    });
    if (document
      .querySelector(".arrow-right")) {
      document
        .querySelector(".arrow-right")
        .addEventListener("click", modal.next);
    }

    document.querySelector
    document
      .querySelector(".arrow-left")
      .addEventListener("click", modal.previous);
  }
};


// function find(value) {

//   for (let i = value; i < employeeData.length - 1; i++) {
//     if (employeeData[i].render ) {
//       return i;
//     } 
//   }
// }

//cards methods
const cards = {
  render: function () {
    let employeeHTML = "";

    $.each(employeeData, function (i, employee) {
      employeeHTML += '<div class="employee-card">';
      employeeHTML += '<img src="' + employee.picture.large + '">';
      employeeHTML += "<ul>";
      employeeHTML +=
        "<li>" +
        uppercase(employee.name.first) +
        " " +
        uppercase(employee.name.last) +
        "</li>";
      employeeHTML += "<li>" + employee.email + "</li>";
      employeeHTML += "<li>" + uppercase(employee.location.city) + "</li>";
      employeeHTML += "</ul>";
      employeeHTML += "</div>";
    });

    $(".main-container").html(employeeHTML);
    cards.setUpEventListeners();
  },
  index: function (target) {
    let items = employeesHTML.children;

    for (let i = items.length - 1; i >= 0; i--) {
      if (target == items[i]) {
        return i;
      }
    }
  },
  filter: function (value) {

    let employeeCards = document.querySelectorAll(".employee-card");

    for (let i = 0; i < employeeCards.length; i++) {
      let ul = employeeCards[i].getElementsByTagName("UL")[0];
      let employee = ul.getElementsByTagName("LI")[0];
      employee = employee.innerText.toLowerCase();

      if (employee.indexOf(value) > -1) {
        employeeCards[i].style.display = "flex";
        employeeData[i].render = true;
      } else {
        employeeCards[i].style.display = "none";
        employeeData[i].render = false;
      }
    }
  },
  setUpEventListeners: function () {
    $(".main-container").on("click", ".employee-card", function (el) {
      let index = cards.index(this);
      searchInput.value = '';
      cards.filter('');
      document.querySelector('body').style.overflow = "hidden";
      modal.render(index);
    });
    searchInput.addEventListener("input", function () {

      cards.filter(this.value.toLowerCase());
    });
  }
};