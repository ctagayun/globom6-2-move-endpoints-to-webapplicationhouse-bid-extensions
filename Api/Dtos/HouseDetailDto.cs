using System.ComponentModel.DataAnnotations;

public record HouseDetailDto(
     int Id, 
     [property: Required] string? Address, //*[property: Required] is data annotation
     [property: Required] string? Country,
     int Price, string? 
     Description, 
     string? Photo);

 //*The data annotations is enforced in Program.cs