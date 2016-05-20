//Initializes variable for use in tracking salaries
var count = 0;

$(document).ready(function () {
  getEmployees();

  //Button event listeners
  $('#employeeSubmit').on('click', postEmployee);
  $('#employeeList').on('click', '.delete', deleteEmployee);
});

//GET function, gets the employee info from DB and appends to DOM
function getEmployees() {
  $('#employeeList').empty();
  $.ajax({
    type: 'GET',
    url: '/employees',
    success: function (employees) {
          count = 0;

          //forEach function loops over each employee object
          employees.forEach(function (employee) {
            console.log(employee);

            //Setting container variable for reuse
            $container = $('<div class="container"></div>');
            $container.append("<p>Name: " + employee.first_name + " " + employee.last_name +
            "</p>", "<p>Employee ID: " + employee.employee_id + "</p>",
            "<p>Job Title: " + employee.job_title + "</p>",
            "<p>Annual Salary: $" + employee.salary + "</p>");

            //Attaches serial id from postgres to each appended div
            $container.data('id', employee.id);
            $container.append('<button class="delete">Delete</button>');
            $('#employeeList').append($container);

            //Calculates average monthly salary cost
            count += Math.round(employee.salary/12);
          });

        //Updates the average monthly salary cost on the DOM
        updateCount();
          }
        });
  };

//Takes info from the input fields and posts them to the DB
//getEmployees runs on success which then updates the DOM
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

//Returns the serial id from each appended div so they can be identified
//for use in the deleteEmployee function
function getEmployeeId(button) {
  var employeeId = $(button).parent().data('id');
  return employeeId;
  }

//Deletes employees from DB, the DOM is updated when getEmployees runs on success
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

//Appends the monthly salary cost to the DOM
function updateCount() {
  $('#salarycontainer').empty();
  $('#salarycontainer').append('<p class="salary">Total Monthly Salary: $' + count + '</p>');
}
