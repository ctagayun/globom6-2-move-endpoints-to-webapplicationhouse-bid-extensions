import React, { useState } from "react";
import { House } from "../types/house";
import toBase64 from "../toBase64";  //*This the function we wrote to convert an image to a string

//*This component needs 2 props: 
//*1. house instance and the 
//*2. the function to be called
type Args = {
  house: House;
  submitted: (house: House) => void; //*as a param we will supply a filled-up house
};

//*We destructure the house object and callback function.
//*{ house, submitted }: Args -  means destructure the prop it in 
//*type called "args"
const HouseForm = ({ house, submitted }: Args) => {

  //*Props are just used here to communicate between components.
  //*We are not using them as component state.
  //* useState({ ...house }) means the spread will use the values
  //* we get from the prop.
  //*JavaScript's spread operator allows us to literally spread all key/value pairs 
  //*of an object to another object. This can also be done in React's JSX. 
  //*To do that use spread operator '...' to pass all the object's key/value pairs as 
  //*attribute/value pairs to a JSX element in this case "houseState"
  const [houseState, setHouseState] = useState({ ...house });

  //*Note: React.MouseEventHandler<HTMLButtonElement>
  //* is the type of the onSubmit function
  //*which gets an event information object again (e.g.  async (e))
  const onSubmit: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault(); //*needed because the default browser behavior for 
                        //*a submit is to generate a POST request to the server with a form data.
                        //*we want to control that ourselves so we are opting out.
    submitted(houseState);  //*Now the parent component has to be notified of the submission.
                            //*So the function (e.g submitted) has to be called here that was provided in the
                            //*props passing in the "houseState" object that has been kept up
                            //*to date while the user filled out the input.
  };

  //*Event handler when upload image box is changed. It is an async function that returns a PROMISE
  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>)  //* the parameter React.ChangeEvent is the type for change event
    : Promise<void> => {  //*The return type is an empty promise
    e.preventDefault();   //*the first thing to be done is to preevent the default browser behavior  
    e.target.files && e.target.files[0] //*second is to check if there are files on target the target 
                                        //*is the HTML input box element in this case
                                        //*and if there are files we want to make there is a first file
                                        //*indicated by [0]
    && setHouseState({        //*If the there is a first file we want to modify the houseState do that      
        ...houseState,        //*the photo gets added.
        photo: await toBase64(e.target.files[0]),  //*The photo property is just a string.
      });                                          //*So convert the photo to string using toBase64 
                                                   //*we need to write ourselves.
  };                                               //*Javascript has a way to convert image to a 
                                                   //*base64-encoded string and create a so-called data URL
                                                   //*out of it that can be used in an image tag.             
                                                   
  return (
    //*Note we have  a FORM tag
    <form className="mt-2">
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          className="form-control"
          placeholder="Address"
          value={houseState.address} //*meaning the value of the input, in other words 
                                     //*the text visible in the input, is the value address 
                                     //*property of the houseState
          onChange={(e) => //* first the handler gets an object "e" containing information about the event. 
            //* 1. setHouseState prop is called. And as a parameter a new house instance has to be supplied.
            //*    (e.g houseState)   
            //* 2. then spread operator is applied to houseState (...houseState). We are copying all 
            //*    properties and values (KV pair) from the "house"
            //* 3. address: e.target.value = we are overwriting the address property of the house
            //*    with the value of the input box
            //* e.target.value = contains the value of the input box
                
            //* Because the state change, the component will rerender thereby displayin the new 
            //* value of the address input box.
            setHouseState({ ...houseState, address: e.target.value }) 
          }
        />
      </div>
      <div className="form-group mt-2">
        <label htmlFor="country">Country</label>
        <input
          type="text"
          className="form-control"
          placeholder="Country"
          value={houseState.country}
          onChange={(e) =>
            setHouseState({ ...houseState, country: e.target.value })
          }
        />
      </div>
      <div className="form-group mt-2">
        <label htmlFor="description">Description</label>
        <textarea
          className="form-control"
          placeholder="Description"
          value={houseState.description}
          onChange={(e) =>
            setHouseState({ ...houseState, description: e.target.value })
          }
        />
      </div>
      <div className="form-group mt-2">
        <label htmlFor="price">Price</label>
        <input
          type="number"
          className="form-control"
          placeholder="Price"
          value={houseState.price}
          onChange={(e) =>
            setHouseState({ ...houseState, price: parseInt(e.target.value) })
          }
        />
      </div>
       {/* Html code for uploading image */}
       <div className="form-group mt-2">
        <label htmlFor="image">Image</label>
        <input
          id="image"
          type="file"
          className="form-control"
          onChange={onFileSelected} //*event handler when input box is changed. It is an async function
        />
      </div>
       {/* End Html code for uploading image */}
      <div className="mt-2">
        <img src={houseState.photo}></img>
      </div>  
      <button
        className="btn btn-primary mt-2"
        //* disabled={!houseState.address || !houseState.country}
        disabled={!houseState.address}
        onClick={onSubmit}
      >
        Submit
      </button>
    </form>
  );
};

export default HouseForm;
