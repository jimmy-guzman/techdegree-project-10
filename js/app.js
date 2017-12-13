const overlay = document.querySelector('.overlay');

let employeesHTML = document.querySelector('.main-container');
let employeeData = {};
$.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=us&inc=picture,name,email,location,cell,dob,login',
    dataType: 'json',
    success: function (response) {
        employeeData = response.results;

        let employeeHTML = '';

        $.each(response.results, function (i, employee) {
            employeeHTML += '<div class="employee">';
            employeeHTML += '<img src="' + employee.picture.large + '">';
            employeeHTML += '<ul>'
            employeeHTML += '<li>' + uppercase(employee.name.first) + ' ' + uppercase(employee.name.last) + '</li>';
            employeeHTML += '<li>' + employee.email + '</li>';
            employeeHTML += '<li>' + uppercase(employee.location.city) + '</li>';
            employeeHTML += '</ul>';
            employeeHTML += '</div>';

        });

        $('.main-container').html(employeeHTML);

    }
});


function uppercase(string) {
    let array = string.split(' ');
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i].charAt(0).toUpperCase() + array[i].slice(1);
    }
    return array.join(' ');
}

function renderModal(index) {
    let dob = function () {
        let dob = employeeData[index].dob.split(' ');
        let array = dob[0].split('-');
        let temp = array.shift();
        array.push(temp);
        return array.join('/');
    };
    let employeeHTML = '';

    employeeHTML += '<div class="modal">';
    employeeHTML += '<span class="close"> &times;</span>';
    employeeHTML += '<span class="arrow arrow-right"> &rarr; </span>';
    employeeHTML += '<span class="arrow arrow-left"> &larr; </span>';
    employeeHTML += '<img src="' + employeeData[index].picture.large + '">';
    employeeHTML += '<ul>'
    employeeHTML += '<li>' + uppercase(employeeData[index].name.first) + ' ' + uppercase(employeeData[index].name.last) + '</li>';
    employeeHTML += '<li>' + employeeData[index].email + '</li>';
    employeeHTML += '<li>' + uppercase(employeeData[index].location.city) + '</li>';
    employeeHTML += '<hr>';
    employeeHTML += '<li>' + employeeData[index].cell + '</li>';
    employeeHTML += '<li>' + uppercase(employeeData[index].location.street) + ', ' + uppercase(employeeData[index].location.state) + ' ' + employeeData[index].location.postcode + '</li>';
    employeeHTML += '<li>' + 'Birthday: ' + dob() + '</li>';
    employeeHTML += '</ul>';
    employeeHTML += '</div>';
    overlay.style.display = 'flex';
    $('.overlay').html(employeeHTML);

    document.querySelector('.close').addEventListener('click', function () {
        overlay.style.display = 'none';
    });
    document.querySelector('.close').addEventListener('mouseover', function () {
        document.querySelector('.modal').style.opacity = '.7';

    });
    document.querySelector('.close').addEventListener('mouseout', function () {
        document.querySelector('.modal').style.opacity = '1';
    });
    document.querySelector('.arrow-right').addEventListener('click', function () {
        if (index === 11) {
            index = 0;
        } else {
            index += 1;
        }
        renderModal(index);
    });
    document.querySelector('.arrow-left').addEventListener('click', function () {
        if (index === 0) {
            index = 11;
        } else {
            index -= 1;
        }
        renderModal(index);
    });
}

$('.main-container').on('click', '.employee', function (el) {
    let index = findIndex(this);
    renderModal(index);

});



function findIndex(child) {
    let parent = document.querySelector('.main-container');
    let children = parent.children;

    for (var i = children.length - 1; i >= 0; i--) {
        if (child == children[i]) {
            break;
        }
    }
    return i;
};

document.querySelector('input').addEventListener('input', function () {
    let employees = document.querySelectorAll('.employee');

    for (let i = 0; i < employees.length; i++) {
        let ul = employees[i].getElementsByTagName('UL')[0];
        let employee = ul.getElementsByTagName('LI')[0];
        employee = employee.innerText.toLowerCase();

        if (employee.indexOf(this.value) > -1) {
            employees[i].style.display = "flex";
        } else {
            employees[i].style.display = "none";
        }

    }
});