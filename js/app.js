const overlay = document.querySelector(".overlay");
const employeesHTML = document.querySelector(".main-container");
const searchInput = document.querySelector("input");
let employeeData = {};

// get employee data
$.ajax({
  url: "https://randomuser.me/api/?results=12&nat=us&inc=picture,name,email,location,cell,dob,login",
  dataType: "json",
  success: (response) => {
    employeeData = response.results;
    cards.render();
  }
});

// return uppercased word/words
uppercase = (string) => {
  let array = string.split(" ");
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].charAt(0).toUpperCase() + array[i].slice(1);
  }
  return array.join(" ");
}

// modal methods
const modal = {
  position: 0,
  render: (index) => {
    modal.position = index;

    let dob = () => {
      let dob = employeeData[index].dob.split(" ");
      let array = dob[0].split("-");
      let temp = array.shift();
      array.push(temp);
      return array.join("/");
    };

    let employeeHTML =
      `<div class="modal">
        <span class="close">&times;</span>
        <span class="arrow arrow-right">&rarr;</span>
        <span class="arrow arrow-left">&larr;</span>
        <img src="${employeeData[index].picture.large}">
        <ul>
          <li>${uppercase(employeeData[index].name.first)} ${uppercase(employeeData[index].name.last)} </li>
          <li>${employeeData[index].login.username}</li>
          <li>${uppercase(employeeData[index].location.city)}</li>     
          <hr>
          <li>${employeeData[index].email}</li>
          <li>${employeeData[index].cell}</li>
          <li>${uppercase(employeeData[index].location.street)}, ${uppercase(employeeData[index].location.state)} ${employeeData[index].location.postcode}</li>
          <li>Birthday: ${dob()}</li>
        </ul>
      </div>`;

    overlay.style.display = "flex";
    $(".overlay").html(employeeHTML);
    modal.setUpEventListeners();
  },
  next: () => {
    if (modal.position === employeeData.length - 1) {
      modal.position = 0;
    } else {
      modal.position++;
    }
    modal.render(modal.position);
  },
  previous: () => {
    if (modal.position === 0) {
      modal.position = employeeData.length - 1;
    } else {
      modal.position--;
    }
    modal.render(modal.position);
  },
  setUpEventListeners: () => {
    document.querySelector(".close").addEventListener("click", () => {
      document.querySelector('body').style.overflow = "scroll";
      overlay.style.display = "none";
    });
    document.querySelector(".close").addEventListener("mouseover", () => {
      document.querySelector(".modal").style.opacity = ".7";
    });
    document.querySelector(".close").addEventListener("mouseout", () => {
      document.querySelector(".modal").style.opacity = "1";
    });

    document.querySelector(".arrow-right").addEventListener("click", modal.next);
    document.querySelector(".arrow-left").addEventListener("click", modal.previous);
  }
};

//cards methods
const cards = {
  render: () => {
    let employeeHTML = ``;

    $.each(employeeData, (i, employee) => {
      employeeHTML +=
        `<div class="employee-card">
      <img src="${employee.picture.large}">
        <ul>
          <li>${uppercase(employee.name.first)} ${uppercase(employee.name.last)}</li>
          <li>${uppercase(employee.login.username)}</li>
          <li>${uppercase(employee.location.city)}</li>
        </ul>
      </div>`;
    });

    $(".main-container").html(employeeHTML);
    cards.setUpEventListeners();
  },
  index: (target) => {
    let items = employeesHTML.children;

    for (let i = items.length - 1; i >= 0; i--) {
      if (target == items[i]) {
        return i;
      }
    }
  },
  filter: (value) => {
    let employeeCards = document.querySelectorAll(".employee-card");

    for (let i = 0; i < employeeCards.length; i++) {
      let ul = employeeCards[i].getElementsByTagName("UL")[0];
      let employeeName = ul.getElementsByTagName("LI")[0].innerText.toLowerCase();
      let employeeUsername = ul.getElementsByTagName("LI")[1].innerText.toLowerCase();
      if (employeeName.indexOf(value) > -1 || employeeUsername.indexOf(value) > -1) {
        employeeCards[i].style.display = "flex";
      } else {
        employeeCards[i].style.display = "none";
      }
    }
  },
  setUpEventListeners: () => {
    $(".main-container").on("click", ".employee-card", function (el) {
      let index = cards.index(this);
      searchInput.value = '';
      cards.filter('');
      document.querySelector('body').style.overflow = "hidden";
      modal.render(index);
    });
    searchInput.addEventListener("input", () => {
      cards.filter(searchInput.value.toLowerCase());
    });
  }
};