var count = 0;

$(document).ready(function () {
  getEmployees();
  $('#employeeSubmit').on('click', postEmployee);
  $('#employeeList').on('click', '.delete', deleteEmployee);
});

function getEmployees() {
  $('#employeeList').empty();
  $.ajax({
    type: 'GET',
    url: '/employees',
    success: function (employees) {
          count = 0;
          employees.forEach(function (employee) {
            console.log(employee);
            $container = $('<div class="container"></div>');
            $container.append("<p>Name: " + employee.first_name + " " + employee.last_name +
            "</p>", "<p>Employee ID: " + employee.employee_id + "</p>",
            "<p>Job Title: " + employee.job_title + "</p>",
            "<p>Annual Salary: $" + employee.salary + "</p>");
            $container.data('id', employee.id);
            $container.append('<button class="delete">Delete</button>');
            $('#employeeList').append($container);
            count += Math.round(employee.salary/12);
          });
        updateCount();
          }
        });
  };

function postEmployee(event) {
  event.preventDefault();
  var employee = {};

$.each($('#employeeForm').serializeArray(), function (i, field) {
  employee[field.name] = field.value;
      });

$.ajax({
  type: 'POST',
    url: '/employees',
    data: employee,
    success: function (data) {
    getEmployees();
     },
    });
  }

function getEmployeeId(button) {
  var employeeId = $(button).parent().data('id');
  return employeeId;
  }

function deleteEmployee() {
  var employeeId = getEmployeeId($(this));
  $.ajax({
    type: 'DELETE',
    url: '/employees/' + employeeId,
    success: function (data) {
      getEmployees();
    },
  });
}

function updateCount() {
  $('#salarycontainer').empty();
  $('#salarycontainer').append('<p class="salary">Total Monthly Salary: $' + count + '</p>');
}
