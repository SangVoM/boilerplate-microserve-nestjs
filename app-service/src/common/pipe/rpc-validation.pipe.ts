import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RpcException } from '@nestjs/microservices';
import * as moment from 'moment';

@Injectable()
export class RPCValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !RPCValidationPipe.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new RpcException(
        JSON.stringify(RPCValidationPipe.flattenValidationErrors(errors)),
      );
    }
    return value;
  }

  private static toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private static flattenValidationErrors(validationErrors) {
    const errorMsg = {};
    validationErrors.map((ve) => {
      errorMsg[ve.property] = [...Object.values(ve.constraints)];
    });
    return errorMsg;
  }
}

export const requiredType = {
  email: 'email',
  number: 'number',
  string: 'string',
  text: 'text',
  phone: 'phone',
  array: 'array',
  dateTime: 'dateTime',
  fax: 'fax',
  boolean: 'boolean',
  postalCode: 'postalCode',
  date: 'date',
  time: 'time',
};

export const regex = {
  postalCode: /^(\d{7}|\d{3}-\d{4})$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  phoneNumber: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
  number: /^[0-9][0-9]*([.][0-9]{2}|)$/,
  kana: /^([ァ-ンー]+)$/,
};

const format = {
  date: 'YYYY-MM-DD',
  time: 'HH:mm',
};

export interface IValidation {
  value: string;
  type: string;
  max?: number;
  min?: number;
  required?: any;
  regex?: any;
  err?: any;
  in?: any;
}

export const handleCheckValidation = (
  attributes: IValidation[],
  value: any,
) => {
  try {
    return attributes.find((attr) => {
      const nameErr = attr.value && attr.value.toUpperCase();

      if (attr.required !== false) {
        /** Validate attribute required */
        if (
          !value ||
          value[attr.value] === undefined ||
          value[attr.value] === null ||
          value[attr.value] === ''
        ) {
          attr.err = `REQUIRED_${nameErr}`;
          return true;
        }
      }

      /** validation In */
      if (
        value[attr.value] &&
        attr.in &&
        !attr.in.includes(value[attr.value])
      ) {
        attr.err = `${nameErr}_INVALID`;
        return true;
      }

      if (
        value[attr.value] &&
        attr.regex &&
        !attr.regex.test(value[attr.value])
      ) {
        attr.err = `${nameErr}_INVALID`;
        return true;
      }

      if (value[attr.value]) {
        switch (attr.type) {
          /** Validate attribute is string */
          case requiredType.string:
            attr.max = attr.max ? attr.max : 255;
            if (typeof value[attr.value] !== requiredType.string) {
              attr.err = `${nameErr}_IS_STRING`;
              return true;
            }

            /** Validate max of attribute */
            if (attr.max < value[attr.value].length) {
              attr.err = `${nameErr}_MAX_${attr.max}`;
              return true;
            }
            break;
          /** Validate attribute is string */
          case requiredType.text:
            if (typeof value[attr.value] !== requiredType.string) {
              attr.err = `${nameErr}_IS_TEXT`;
              return true;
            }

            break;
          /** Validate attribute is number */
          case requiredType.number:
            if (typeof value[attr.value] !== requiredType.number) {
              attr.err = `${nameErr}_IS_NUMBER`;
              return true;
            }

            /** Validate max of attribute */
            if (attr.max < value[attr.value]) {
              attr.err = `${nameErr}_MAX_${attr.max}`;
              return true;
            }
            break;
          case requiredType.email:
            attr.max = attr.max ? attr.max : 255;
            /** Validate attribute is email */
            if (!regex.email.test(value[attr.value])) {
              attr.err = `${nameErr}_NOT_VALID_EMAIL`;
              return true;
            }

            /** Validate max of attribute */
            if (attr.max < value[attr.value].length) {
              attr.err = `${nameErr}_MAX_${attr.max}`;
              return true;
            }
            break;
          case requiredType.phone:
            attr.max = attr.max ? attr.max : 255;
            /** Validate attribute is phone */
            if (!regex.phoneNumber.test(value[attr.value])) {
              attr.err = `${nameErr}_NOT_VALID_PHONE_NUMBER`;
              return true;
            }

            /** Validate max of attribute */
            if (attr.max < value[attr.value].length) {
              attr.err = `${nameErr}_MAX_${attr.max}`;
              return true;
            }
            break;
          case requiredType.array:
            if (!Array.isArray(value[attr.value])) {
              attr.err = `${nameErr}_IS_ARRAY`;
              return true;
            }

            /** Validate max of attribute */
            if (attr.max < value[attr.value].length) {
              attr.err = `${nameErr}_MAX_${attr.max}`;
              return true;
            }

            /** Validate min of attribute */
            if (attr.min > value[attr.value].length) {
              attr.err = `${nameErr}_MIN_${attr.min}`;
              return true;
            }
            break;
          case requiredType.dateTime:
            const dateTime = moment(new Date(value[attr.value]));
            if (!dateTime.isValid()) {
              attr.err = `${nameErr}_IS_DATE_TIME`;
              return true;
            }

            /** convert to date time */
            value[attr.value] = dateTime.toDate();
            break;
          case requiredType.date:
            const date = moment(value[attr.value], format.date);
            if (!date.isValid()) {
              attr.err = `${nameErr}_IS_DATE_FORMAT_${format.date}`;
              return true;
            }

            /** convert to date */
            value[attr.value] = date.format(format.date);
            break;
          case requiredType.time:
            const time = moment(value[attr.value], format.time);
            if (!time.isValid()) {
              attr.err = `${nameErr}_IS_TIME_FORMAT_${format.time}`;
              return true;
            }

            /** convert to date */
            value[attr.value] = time.format(format.time);
            break;
          case requiredType.postalCode:
            /** Validate attribute is fax */
            if (!regex.postalCode.test(value[attr.value])) {
              attr.err = `${nameErr}_NOT_VALID_POSTAL_CODE`;
              return true;
            }
            break;
          case requiredType.boolean:
            /** Validate attribute is boolean */
            if (typeof value[attr.value] !== requiredType.boolean) {
              attr.err = `${nameErr}_IS_BOOLEAN`;
              return true;
            }
            break;
          default:
            break;
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};
