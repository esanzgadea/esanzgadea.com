// JavaScript Document for changing color on refresh


$( document ).ready(function() {
    var listOfClasses = ["red","yellow","green"];
    var randomNum = Math.floor(Math.random() * listOfClasses.length); 
    $("colorin").addClass(listOfClasses[randomNum]);
});