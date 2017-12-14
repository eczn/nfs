// loadAsDataURL.js
export default function(file){
    let reader = new FileReader(); 
    return new Promise(res => {
        reader.onload = function(e){
            res(e.target.result);
        }
        reader.readAsDataURL(file)
    }).catch(err => {
        console.log(err); 
    })
}
