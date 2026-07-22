// JavaScript Document


$( document ).ready(function() {
    var listOfClasses = ["color-scheme-1","color-scheme-2","color-scheme-3"];
    var randomNum = Math.floor(Math.random() * listOfClasses.length); 
    $("html").addClass(listOfClasses[randomNum]);
});