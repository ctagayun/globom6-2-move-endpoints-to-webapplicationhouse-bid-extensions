//import { useNavigate } from "react-router-dom";
//import Problem from "../types/problem";
import { House } from "./../types/house";
import axios, { AxiosError, AxiosResponse } from "axios";
import config from "../config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Problem from "../types/problem";


//This is a custom hook. Basically a custom hook is a function
//that can use other hooks such as useState.

//First we want to infer the return type.This hook uses React Query.
//remove House[] array typing seFetchHouses = () : House[] =>...   

//Next we don't need a call to useState and useEffect anymore see lines 32-42
//and that's because React Query is taking care of managing the state for us.

//UseQuery is something that fetch data. It is generic. First it expects
//the type of data we expect to get (e.g House[]) and second is a type 
//we expect to get when something goes wrong.

//Sidebar: 
//  useQuery is a hook that has internal state. Therefore the hook we define
//here will re-render when the internal state of useQuery changes. And that
//will cause all components that use useFetchHouses snd child components
//to re-render as well.

//Objects fed to useQuery:
//  queryKey: ["houses"] - the queryKey property inside that object is the 
//     cache key it has to be in the form of array.
//  queryFn: this property contains the stuff on how you want to get the data
const useFetchHouses = () => {
  return useQuery<House[], AxiosError>({
    queryKey: ["houses"],  //*cache
    queryFn: () =>
      axios.get(`${config.baseApiUrl}/houses`).then((resp) => resp.data),
  });
};

//*this method accepts an id parameter. I am using it as key for the cache:  queryKey: ["houses", id],
//*the cache is created when this method executes.
//*when this hook is rerendered WITH THE SAME ID by the component that mounts it, the list if houses is returned 
//*from the cache if it is still valid
const useFetchHouse = (id: number) => {
  return useQuery<House, AxiosError>({
    queryKey: ["houses", id],  //*The cache is created now an array with a combination of string "houses" and the id.
    queryFn: () =>
      axios.get(`${config.baseApiUrl}/house/${id}`).then((resp) => resp.data),
  });
};

//*useAddHouse will use React Query to create HTTP POST to the API 
//*React Query hook uses data mutation like POSTs.
//*For add there's no cache key:  queryKey: ["houses", id],  
//*like in useFetchHouse.
//*Because for useMutation we don't need cache
const useAddHouse = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate(); //* this hookwill be used to navigate to the list of houses once POST is done successfully
 
  //*When something goes wrong Axios generate an object called "AxiosError"
  //*add generic type Problem (defined in src/types/problem.ts) to AxiosError 
  //*to indicate that the payload of an error response will contain our new "Problem"
  return useMutation<AxiosResponse, AxiosError<Problem>, House>({

    //*No cache key here instead we just write the arrow function that executes the request.
    //*(h) means get the house instance and we post that to the API endpoint Axios
    mutationFn: (h) => axios.post(`${config.baseApiUrl}/houses`, h), //* "h" param is the instance of the new house
    onSuccess: () => {
      queryClient.invalidateQueries({   //*invalidated cache using queryClient.invalidateQueries
        queryKey: ["houses"] 
       }); //*we know that after successful POST the cache is no longer valid and needs to be invalidated using queryClient.invalidateQueries
     nav("/");  //*then on success we want to navigate to the list of houses
    },
  });
};

//*PUT and DELETE are called useMutations
const useUpdateHouse = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  return useMutation<AxiosResponse, AxiosError<Problem>, House>({
    mutationFn: (h) => axios.put(`${config.baseApiUrl}/houses`, h),
    onSuccess: (_, house) => {  //*we used underscore "_" for unused param, the second param is "house" instance
      queryClient.invalidateQueries({   //*invalidated cache using queryClient.invalidateQueries
        queryKey: ["houses"] 
      });
      nav(`/house/${house.id}`); //*navigate back to the list of houses using the id of the house
    },
  });
};

//*PUT and DELETE are called useMutations
const useDeleteHouse = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  return useMutation<AxiosResponse, AxiosError, House>({
    mutationFn: (h) => axios.delete(`${config.baseApiUrl}/houses/${h.id}`), //*on the delete just send the house.id
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["houses"] }); //*invalidated cache using queryClient.invalidateQueries
      nav("/");
    },
  });
};

//*Export the hooks
export default useFetchHouses;
export {
  useFetchHouse,
  useAddHouse,
  useUpdateHouse,
  useDeleteHouse,
};
  


//Note: (): House[] - this means we are declaring the return type
//to be of type House[] array.
// const useFetchHouses = (): House[] => {
//   const [houses, setHouses] = useState<House[]>([]);
//   useEffect(() => { 
//     const fetchHouses = async () => { 
//       const rsp = await fetch(`${config.baseApiUrl}/houses`);
//       const houses = await rsp.json();  
//       setHouses(houses); 
//       };
//       fetchHouses();
//     }, //eof function
//     []   //this is the second parameter the "dependency array"
//   ) 

//   return houses;
// }; //eof useFetchHouses