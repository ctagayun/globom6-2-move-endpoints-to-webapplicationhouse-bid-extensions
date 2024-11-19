import { useParams } from "react-router-dom";
import ApiStatus from "../apiStatus";
import { useFetchHouse, useUpdateHouse } from "../hooks/HouseHooks";
import ValidationSummary from "../ValidationSummary";
import HouseForm from "./HouseForm";

const HouseEdit = () => {

  //*We have to know which house to update. Iwant to get the house id
  //*from the URL using useParams from "react-router-dom"; just like we
  //*we did in the HouseDetail component
  const { id } = useParams();

  //*We have to throw an error if Id is not supplied.
  if (!id) throw Error("Need a house id");

  //*Then parse id into an integer
  const houseId = parseInt(id);

  //*Now use useFetchHouse hook defined in src/hook/HouseHook to get the house
  //*passing in the houseId. It returns the following: data, status and boolean isSuccess flag
  const { data, status, isSuccess } = useFetchHouse(houseId);

  //*To update the house:
  //*First create an instance of the object (hook) useUpdateHouse() that can do 
  //*the mutation. It is defined in src/hook/HouseHooks.ts. 
  //*It is important to call this before returning the APIStatus component because
  //*hooks should always be called unconditionally
  const updateHouseMutation = useUpdateHouse();

  if (!isSuccess) return <ApiStatus status={status} />;

  //*And again the return tsx is a HouseForm with the house and the and arrow function that calls
  //*mutate
  return (
    <>
      {updateHouseMutation.isError && (
        <ValidationSummary error={updateHouseMutation.error} />
      )}
      <HouseForm
        house={data}
        //*Next write an arrow function for "submitted"
        //*We know it gets a house passed in as prop to "submitted()"
        //*Now it is defined in src/hook/HouseHooks.ts

        //*updateHouseMutation object is an instance of useUpdateHouse() in src/hook/HouseHooks.ts
        //*"mutate" can be called on the mutation object passing in the house.
        //*This will do the actual POST request
        submitted={(house) => {
          updateHouseMutation.mutate(house);
        }}
      />
    </>
  );
};

export default HouseEdit;
