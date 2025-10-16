function HelloBtn2(){
    const message = (name) =>{
        alert("Gello" + name );
    }

    return(
        <button onClick={()=>(message("Sally"))}
        >Click me</button>
    );
}