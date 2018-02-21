/* JS for WATS 3020 Roster Project */

///////////////////////////////////////////////////
//////// TODOs ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Fill in the blanks below to complete each TODO task.                       //
////////////////////////////////////////////////////////////////////////////////

//Person, typically student's name, email, and username-generated email address with a split '@'.

class Person {
  constructor(name,email) {
    this.name = name;
    this.email = email;
    this.username = email.split('@')[0];
  }
}

//Student class extended from Person. [] signifies empty array because attendance varies.
//(Shawn's NOTE: You will need to use the `super()` command so you don't lose the functionality of the
// `constructor()` method from the `Person` class.)
//
class Student extends Person {
  constructor (name, email) {
    super(name, email);
    this.attendance = [];
  }

//Student attendance is calculated based on an average. 0 for absence, 1 for present. 
  //*100 for percentage out of 'full possible attendance'.
  calculateAttendance() {
    if (this.attendance.length > 0) {
    let counter = 0;
    for (let mark of this.attendance) {
      counter = counter + mark;
    }
    let attendancePercentage = counter / this.attendance.length * 100;
    return `${attendancePercentage}%`;
    } else {
      return "0%";
    }
  }
}


// Teacher class extended from Person.

class Teacher extends Person {
  constructor(name,email,honorific) {
    super(name,email);
    this.honorific = honorific;
  }
}

// TODO: Set up our Course class so we can run the whole roster from it.
class Course {
    constructor(courseCode, courseTitle, courseDescription){
        this.code = courseCode;
        this.title = courseTitle;
        this.description = courseDescription;
        this.teacher = null;
        this.students = [];
    }

  //Add a new student with this function. Information is subbed into this function.
  //And displayed in the tabs below the headers.
  
  addStudent() {
    let name = prompt('Student Full Name:');
    let email = prompt('Student email:');
    let newStudent = new Student(name, email);
    this.students.push(newStudent);
    updateRoster(this);
  }

    //setTeacher() should have New Teacher properties etc.
  setTeacher() {
    let name = prompt('Teacher Full Name:');
    let email = prompt('Teacher Email address:');
    let honorific = prompt('Honorific (e.g. Dr., Prof., Mr., Ms.):');
    
    this.teacher = new Teacher(name, email, honorific);
    updateRoster(this);
  }

    //markAttendance function based on 'present' = 1, absent = 0 values
  //clicking either present or absent button will update the roster with the correct percentage. 
  
  markAttendance(username, status = 'present') {
    let student = this.findStudent(username);
    if (status === 'present') {
      student.attendance.push(1);
    } else {
      student.attendance.push(0);
    }
    updateRoster(this);
  }


    //////////////////////////////////////////////
    // Methods provided for you -- DO NOT EDIT /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    findStudent(username){
        // This method provided for convenience. It takes in a username and looks
        // for that username on student objects contained in the `this.students`
        // Array.
        let foundStudent = this.students.find(function(student, index){
            return student.username == username;
        });
        return foundStudent;
    }
}

/////////////////////////////////////////
// TODO: Prompt User for Course Info  //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//
// Prompt the user for information to create the Course. In order to create a
// `Course` object, you must gather the following information:

let courseCode = prompt ('Please enter the course Code, (e.g. WATS3020):','TEST 3000');

let courseTitle = prompt ('The Title of your course:','TESTING FOR EVERYONE');

let courseDescription = prompt ('Description of your course:','A great course for aspiring web developers');
// Create a new `Course` object instance called `myCourse` using the three data points just collected from the user.
// TODO: Add in the values for the information supplied by the user above.
let myCourse = new Course(courseCode, courseTitle, courseDescription);

///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher){
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function(e){
    console.log('Calling addStudent() method.');
    myCourse.addStudent();
})

// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function(e){
    console.log('Calling setTeacher() method.');
    myCourse.setTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course){
    let rosterTbody = document.querySelector('#roster tbody');
    // Clear Roster Content
    rosterTbody.innerHTML = '';
    if (course.teacher){
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
    } else {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = "Not Set";
    }
    // Populate Roster Content
    for (student of course.students){
        // Create a new row for the table.
        let newTR = document.createElement('tr');

        // Create table cells for each data point and append them to the new row.
        let nameTD = document.createElement('td');
        nameTD.innerHTML = student.name;
        newTR.appendChild(nameTD);

        let emailTD = document.createElement('td');
        emailTD.innerHTML = student.email;
        newTR.appendChild(emailTD);

        let attendanceTD = document.createElement('td');
        attendanceTD.innerHTML = student.calculateAttendance();
        newTR.appendChild(attendanceTD);

        let actionsTD = document.createElement('td');
        let presentButton = document.createElement('button');
        presentButton.innerHTML = "Present";
        presentButton.setAttribute('data-username', student.username);
        presentButton.setAttribute('class', 'present');
        actionsTD.appendChild(presentButton);

        let absentButton = document.createElement('button');
        absentButton.innerHTML = "Absent";
        absentButton.setAttribute('data-username', student.username);
        absentButton.setAttribute('class', 'absent');
        actionsTD.appendChild(absentButton);

        newTR.appendChild(actionsTD);

        // Append the new row to the roster table.
        rosterTbody.appendChild(newTR);
    }
    // Call function to set event listeners on attendance buttons.
    setupAttendanceButtons();
}

function setupAttendanceButtons(){
    // Set up the event listeners for buttons to mark attendance.
    let presentButtons = document.querySelectorAll('.present');
    for (button of presentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} present.`);
            myCourse.markAttendance(e.target.dataset.username);
            updateRoster(myCourse);
        });
    }
    let absentButtons = document.querySelectorAll('.absent');
    for (button of absentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} absent.`);
            myCourse.markAttendance(e.target.dataset.username, 'absent');
            updateRoster(myCourse);
        });
    }
}

