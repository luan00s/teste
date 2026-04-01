function AnimalCard({nome,numero}){

 return(

  <div className="animal-card">

   <div className="animal-img">
    🐾
   </div>

   <h3>{numero} - {nome}</h3>

   <button>
    Apostar
   </button>

  </div>

 )

}

export default AnimalCard