export interface User {
    id: string;
    userName: string;
    password: string; // Note: Usually, you won't transfer passwords to the frontend
    packageType: string;
    joinDate: number;
    expirationDate: number;
    role: string;
    bettingHouse: string;
    surebetType: string;
    surebetExpirationDate: number;
    telegram: string;
    lastTimeLogged: number;
  }

export interface UserInfo {
  userName : string;
  packageType: string;
  packageDuration: number;
  surebetType: string;
  surebetDuration: number;
}
  