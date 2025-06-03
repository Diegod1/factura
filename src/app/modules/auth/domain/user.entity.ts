export interface LoginResponse {
  Token: string;
  Nombre_Usuario: string;
  Respuesta: {
    Resultado: string;
    Mensaje_Para_Usuario: string;
    Mensaje_Error: string;
  }
}

export interface User {
  usuario: string;
  constrasena: string;
}
