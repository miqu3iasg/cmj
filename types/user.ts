import { v4 as uuidv4 } from 'uuid';

export default class User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  password: string | null;
  

  constructor(name: string, email: string, image: string, createdAt: Date, updatedAt: Date, role: string, isActive: boolean, isDeleted: boolean, password: string | null) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.image = image;
    this.emailVerified = null;
    this.createdAt = Date.now() > createdAt.getTime() ? createdAt : new Date();
    this.updatedAt = Date.now() > updatedAt.getTime() ? updatedAt : new Date();
    this.role = role;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.password = password;
  }


  
}