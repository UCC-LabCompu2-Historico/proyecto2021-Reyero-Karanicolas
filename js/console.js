function GetSelectVelocity(){
    var velocity = document.getElementById("list 2").value;
    console.log(velocity);
    return velocity;
}
function GetSelectDistance(){
    var distance = document.getElementById("list 1").value;
    console.log(distance);
    return distance;
}
function result(){
    var velocity = document.getElementById("list 2").value;
    var distance = document.getElementById("list 1").value;
    var time= velocity/distance;
    return time;
}