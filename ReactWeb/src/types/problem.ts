//*create type Error
type Error = {
  [name: string]: string[];
};

//*Create type Problem. This is community standard to 
//*communicate errors
type Problem = {
  type: string;
  title: string;
  status: number;
  errors: Error; //*this type declared above
};

export default Problem;
