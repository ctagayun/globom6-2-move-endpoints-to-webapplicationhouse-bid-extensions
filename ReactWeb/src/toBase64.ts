const toBase64 = (file: File): Promise<string> => { //*Return a promise so we can await it.
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();     //*The fileReader javascript object can read a file and 
                                             //*turn it to a data URL
    fileReader.onload = () => resolve(fileReader.result as string); //*We resolve the promise, returning the 
                                                                    //*the data URL
    fileReader.onerror = () => reject(); //*If we get an error, we reject the promise
    fileReader.readAsDataURL(file);
  });
};

export default toBase64;  //*Fimally we export the function
