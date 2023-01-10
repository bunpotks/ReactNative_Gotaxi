const conv_formatTel = (value) => {
    let newString = "";

    if(value.length == 9){
        newString += value.substring(0, 2);
        newString += '-';
        newString += value.substring(2, 5);
        newString += '-';
        newString += value.substring(5);
    }else{
        newString += value.substring(0, 3);
        newString += '-';
        newString += value.substring(3, 6);
        newString += '-';
        newString += value.substring(6);
    }
    //----------------------------------------------
  

    return newString;
}

export default conv_formatTel;