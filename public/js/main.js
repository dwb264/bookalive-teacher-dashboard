function getStudents() {
    $.ajax({

      url : '/students',
      type : 'GET',
      dataType:'json',
      success : function(data) {
          makeStudentList(data);
      },
      error : function(request,error)
      {
          alert("Request: "+JSON.stringify(request));
      }
  });
}

getStudents();

function getStudentScores(id) {
  $.ajax({

    url : '/studentScores/' + id,
    type : 'GET',
    dataType:'json',
    success : function(data) {
        showStudentScores(data);
    },
    error : function(request,error)
    {
        showStudentScores(false);
    }
});
}

function makeStudentList(data) {

  studentList = document.getElementById('students');
  data.forEach(function(student) {

    studentInfo = document.createElement('div');
    studentInfo.className = 'studentInfo';

    studentName = document.createElement('p');
    studentId = document.createElement('p');
    pic = document.createElement('img');

    studentName.innerHTML = "<b>Name: </b><br>" + student.firstName + " " + student.lastName;
    studentId.innerHTML = "<b>Student Id: </b><br>" + student.studentId;
    studentName.className = 'name';
    studentId.className = 'studentId';

    pic.setAttribute('src', student.photoUrl);


    viewStats = document.createElement('div');
    viewStats.innerHTML = "<p>View Stats</p>";
    viewStats.className = 'info-button';

    assignModule = document.createElement('div');
    assignModule.innerHTML = "<p>Assign Module</p>";
    assignModule.className = 'info-button';

    studentInfo.appendChild(pic);
    studentInfo.appendChild(studentName);
    studentInfo.appendChild(studentId);

    studentInfo.appendChild(viewStats);
    studentInfo.appendChild(assignModule);

    studentList.appendChild(studentInfo);

    viewStats.addEventListener("click", function() {
      currentStudentName = student.firstName + " " + student.lastName;
      getStudentScores(student.studentId)
    });

    assignModule.addEventListener("click", function() {
      alert("This feature is coming soon!");
    });

  })
}

function showStudentScores(data) {
  console.log(data);
  d3.select('#students').style("display", "none");
  d3.select('#stats').style("display", "inline-block");
  d3.select('svg').remove();
  document.getElementById('student-name').innerHTML = currentStudentName;
  if (data) {
    d3.select(".no-data").style("display", "none");
    makeChart(data);
  } else {
    d3.select(".no-data").style("display", "inline-block");
  }
}

document.getElementById('back').addEventListener('click', function() {
  d3.select('#stats').style("display", "none");
  d3.select('#students').style("display", "inline-block");
})

// Toggle subjects on click
d3.selectAll(".subject").on("click", function() {
  var subject = this.innerHTML;
  var line = document.getElementsByClassName(subject);
  console.log(line);
  if (line[0].style.display === "none") {
    this.style.opacity = 1;
    for (var i = 0; i < line.length; i++) { line[i].style.display = "inline-block"; }
  } else {
    this.style.opacity = 0.5;
    for (var i = 0; i < line.length; i++) { line[i].style.display = "none"; }
  }
})

