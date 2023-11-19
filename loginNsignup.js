// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAmJc3n20vDF-9hIRBjQHnJWZzaaMN2JqA",
  authDomain: "seqa-f9915.firebaseapp.com",
  projectId: "seqa-f9915",
  storageBucket: "seqa-f9915.appspot.com",
  messagingSenderId: "1004640134666",
  appId: "1:1004640134666:web:af235211428a969a3121f3",

  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()
  
  // Set up our register function
  function register () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    username = document.getElementById('username').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
    if (validate_field(username) == false ) {
      alert('One or More Extra Fields is Outta Line!!')
      return
    }
   
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        email : email,
        username : username,
    
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data)
  
      // DOne
      alert('User Created!!')
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  // Set up our login function
  function login () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
  
      // DOne
      alert('User Logged In!!')

    window.location.href = 'home.html'; 
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, retrieve their data
        var userId = user.uid;
        var userRef = firebase.database().ref('users/' + userId);

        userRef.once('value')
            .then(function(snapshot) {
                var userData = snapshot.val();
                if (userData) {
                    // Store user data in local storage
                    localStorage.setItem('userData', JSON.stringify(userData));
                }
            })
            .catch(function(error) {
                console.error('Error retrieving user data:', error);
            });
    }
});

  function getdata(){
    var user = auth.currentUser
// Reference to the specific database path where your data is stored
var dataRef = database.ref();

// 
        // Reference to the user's data in the database
        var userRef = database.ref('users/' + user.uid);

        // Fetch the data
        userRef.once('value')
            .then(function (snapshot) {
                var userData = snapshot.val();
                if (userData) {
                    // Populate the HTML with the fetched data
                    document.querySelector('#name-info').textContent = userData.username;
                    document.querySelector('#email-info').textContent = userData.email; 
                    
                    console.log('fetching data:');
                }
            })
            .catch(function (error) {
                console.error('Error fetching data:', error);
            });
  }
  
  
  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }