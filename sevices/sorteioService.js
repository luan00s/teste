const animais = [
"avestruz","aguia","burro","borboleta","cachorro",
"cabra","carneiro","camelo","cobra","coelho",
"cavalo","elefante","galo","gato","jacare",
"leao","macaco","porco","pavao","peru",
"touro","tigre","urso","veado","vaca"
];

exports.sortearAnimal = () => {

 const indice = Math.floor(Math.random() * animais.length);

 return animais[indice];

};