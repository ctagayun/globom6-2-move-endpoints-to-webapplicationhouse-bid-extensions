import { useAddHouse } from "../hooks/HouseHooks";
import { House } from "../types/house";
import ValidationSummary from "../ValidationSummary";
import HouseForm from "./HouseForm";

const HouseAdd = () => {

  //*First get the object (hook) useAddHouse() that can do the mutation
  //* is defined in src/hook/HouseHooks.ts
  const addHouseMutation = useAddHouse();

  //*We need a house instance to pass to the form component.
  //*Because this is an add all the properties are empty or zero
  const house: House = {
    address: "",
    country: "",
    description: "",
    price: 0,
    id: 0,
    photo: "",
  };

  return (
    <>
      //*Display validation error.
      //*First check if addHouseMutation has returned an error
      {addHouseMutation.isError && (
        //*If so display validation summary passing the error property which 
        //*is now of type AxiosError<Problem>
        <ValidationSummary error={addHouseMutation.error} />
      )}
      
      <HouseForm
        //*All that is left now is to render HouseForm, passing in the "house" as prop
        house={house} 
        //*Next write an arrow function for "submitted"
        //*We know it gets a house passed in as prop to "submitted()"
        //*Now //* is defined in src/hook/HouseHooks.ts

        //*addHouseMutation object is an instance of useAddHouse() which is defined in src/hook/HouseHooks.ts
        //*"mutate" can be called on the mutation object passing in the house.
        //*This will do the actual POST request
        submitted={(house) => addHouseMutation.mutate(house)} 
      />
    </>
  );
};

export default HouseAdd;
