import { AxiosError } from "axios";
import Problem from "./types/problem";

//*Lets create a type for it's props that contains the property error, 
//*which is "AxiosError" of type "Problem"
type Args = {
  error: AxiosError<Problem>;
};

const ValidationSummary = ({ error }: Args) => {

  //* This component is only useful if HTTP response was 400 ny request
  if (error.response?.status !== 400) return <></>; //*This is the response returned when there are validation errors.
                                                    //*If no error return en empty Tsx
  //*Else, we are getting the errors collection which contains the 
  //*validation erros, usig the data property which is of type "Problem"
  const errors = error.response?.data.errors; //*errors: is defined in src/types/problem.ts

  return (
    <>
      <div className="text-danger">Please fix the following:</div>
      //*Once we have the error we iterate over the entries in a dictionary 
      //*and display a unordered list
      {Object.entries(errors).map(([key, value]) => (
        //*Display unordered list for each key and the values are the validation errors.
        <ul key={key}>
          <li>
            {key}: {value.join(", ")}
          </li>
        </ul>
      ))}
    </>
  );
};

export default ValidationSummary;
