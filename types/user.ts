import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const createUserSchema = z.object({
  fullname: z.string(),
  nickname: z.string(),
  email: z.string(),
  password: z.string(),
  authStatus: z.boolean().default(false),
});

export const updateUserSchema = z.object({
  fullname: z.string().optional(),
  nickname: z.string().optional(),
})

type Props = {
  fullname: string;
  nickname: string;
  email: string;
  password: string;
  authStatus: boolean;
};

export default class User {
  private id: string

  private props: Props

  constructor(
    props: Props
  ) {
    this.id = uuidv4();
    this.props = props
  }

  public getProps() {
    return {
      ...this.props,
    }
  }
}