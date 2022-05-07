//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const homeStartingContent = "Tus entradas estarán aquí cuando las guardes.";
let stuff = [];
let posts = [];


app.get("/",function(req,res){
  res.render("index");
});

app.get("/emotions", function(req,res){
  res.render("emotions");
});

app.post("/", function(req,res){

  stuff = [];
  let color = req.body.btnradio.slice(0,1);
  let emotionUpper = req.body.btnradio.slice(1);
  let emotion = emotionUpper.toLowerCase();

  if(color == "r" || color == "b"){
    let polaridad = "negativa";
    stuff.push(polaridad);
  }else{
    let polaridad = "positiva";
    stuff.push(polaridad);
  }

  if(color == "r" || color=="y"){
    let energia = "mucha";
    stuff.push(energia);
  }else{
    let energia = "poca";
    stuff.push(energia);
  }

  stuff.push(emotion);

  if(color == "r"){
    color = "red";
    stuff.push(color);
  }else if(color =="b"){
    color = "blue";
    stuff.push(color);
  }else if(color =="g"){
    color = "green";
    stuff.push(color);
  }else if(color =="y"){
    color = "yellow";
    stuff.push(color);
  }



  if(stuff[1] == "mucha" && stuff[0]== "negativa"){
    let mensajito = "La emoción que has seleccionado es válida, puedes sentirte de esta manera. Sin embargo, aquí te podemos recomendar diferentes técnicas para poder relajarte y bajar tu nivel de estrés emocional que se encuentra alto en este momento; pueda ser desde realizando actividades al aire libre como meditar, leer un libro o simplemente respirar tranquilamente. Todo esto con el fin de que puedas mantener la calma y el equilibrio emocional.";
    stuff.push(mensajito);
  }else if(stuff[1] == "poca" && stuff[0]=="negativa"){
    let mensajito = "La emoción que seleccionaste es válida, y puede sentirse en diferentes ocasiones debido a diversas situaciones. Por ello, aquí te recomendamos que te tomes un tiempo contigo misma para pensar las sensaciones y sentimientos que estas teniendo, de esta manera podrás analizarte más a ti misma y podrás reconciliarte con tu ser para poder sentirte en paz contigo misma, ya sea sintiendo diferentes emociones o las mismas pero con mayor claridad. También puedes realizar actividades con más personas, ya que, está comprobado que cuando estás con más personas en la mayoría de los casos el nivel de felicidad aumenta, puedes estar con amigos o familia, de preferencia personas cercanas porque ellos siempre son una buena medicina para el corazón. Al estar con ellos si lo deseas puedes hablarles de cómo te sientes, esto es muy liberador y en la mayor parte de las veces las personas se sienten mejor después de hablar con alguien.";
    stuff.push(mensajito);
  }else if(stuff[1] == "mucha" && stuff[0]=="positiva"){
    let mensajito = "La emoción que seleccionaste es una de las mejores para muchos, ya que, te sientes muy motivado y enérgico. Es por ello, que debes disfrutar esta sensación y los sentimientos que estás teniendo ahora. Sin embargo, si te sientes demasiado enérgico, hay una principal actividad que te sugerimos realizar para poder calmar el nivel de tu emoción, la cual es respirar profundamente y seguir adelante, esa es la más sencilla que te recomendamos en esta ocasión. Disfruta el momento, tu día y la vida siempre.";
    stuff.push(mensajito);
  }else if(stuff[1] =="poca" && stuff[0]=="positiva"){
    let mensajito = "Esta emoción, es una emoción positiva, te recomendamos que la vivas y disfrutes de ella ahora que la estás sintiendo. La emoción que elegiste ocurre en ocasiones en las que nos sentimos bien con nosotros mismos por haber logrado algo o simplemente cuando estamos con una persona o lugar en el que nos sentimos bien. No te alejes de los lugares o personas que te hacen sentir de esta manera, ya que, son positivas para tu vida y tus emociones.";
    stuff.push(mensajito);
  }

  // console.log(stuff);

  res.redirect("/message");
});

app.get("/message", function(req,res){

  res.render("message",{
    emotion: stuff[2],
    energy: stuff[1],
    polaridad: stuff[0],
    color: stuff[3],
    mensajito: stuff[4]

  });
});

app.get("/hotline", function(req,res){
  res.render("hotline");
});


//ANEXED code


app.get("/journal", function(req, res) {

const links = [];

posts.forEach(function(post){
  let transformedTitle = _.lowerCase(post.title);
  transformedTitle = _.deburr(transformedTitle);
  transformedTitle = _.kebabCase(transformedTitle);
  links.push(transformedTitle);
});

res.render("journal", {
    homeStartTxt: homeStartingContent,
    posts: posts,
    links : links
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/posts/:postId", function(req, res) {

  let postLowerCased = _.lowerCase(req.params.postId);
  //para esta clase de for, cada "post" equivale a array[i] en el for normal. Puedes asignar cuaquier nombre, solo sirve para representar la variable
  posts.forEach(function(post) {
    //transformar el título del post a minúsculas y sin acentos o caracteres espciales.
    let transformedTitle = _.lowerCase(post.title);
    transformedTitle = _.deburr(transformedTitle);
    //si el título del post y el titulo requerido coinciden, console.log("Match found")

    if (transformedTitle === postLowerCased) {
      console.log("Match found!");
      res.render("entrada", {
        postTitle: post.title,
        postContent: post.post
      });
    } else {
      console.log("Match not found");
    }
  });

});

//app posts requests

app.post("/compose", function(req, res) {

  const post = {
    title: req.body.postTitle,
    post: req.body.postContent,
  };
  posts.push(post);
  res.redirect("/journal");
});


//preparar el servidor para escuchar el puerto 3000
app.listen(3000,function(){
  console.log("Server has started <3");
});
