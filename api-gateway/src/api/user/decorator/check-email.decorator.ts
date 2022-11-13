import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';

export function CheckEmailExits(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: CheckEmailConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'CheckEmailExits', async: true })
@Injectable()
export class CheckEmailConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly userService: UserService) {}

  async validate(value: any) {
    try {
      const user = await this.userService.findByEmail(value);
      console.log('user: ', user);
      return !user;
    } catch (e) {
      return e.code === 400;
    }
  }
}
