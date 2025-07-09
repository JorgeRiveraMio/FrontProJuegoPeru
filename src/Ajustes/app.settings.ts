import { environment } from "../environments/environment";

export const appsettingsCliente = {
    apiUrl: environment.apiUrl 
};

export const appsettingsDni={
    apiUrl: environment.apiUrl + "/consultar-dni",
    apiKey:"apis-token-10511.jrLt6-0vX9b2y3fABmj4J-yYAqR4Up9s"
}