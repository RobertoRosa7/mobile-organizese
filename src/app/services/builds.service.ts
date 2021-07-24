/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Register, User } from '../interfaces/general';

export class BuildsService {
  public static buildRegister(
    form: FormGroup,
    user: User,
    type: string
  ): Register {
    return {
      category: form.value.category || 'Outros',
      value: form.value.value,
      brand: form.value.brand || '',
      edit: false,
      description: form.value.description?.trim() || 'Sem descrição',
      status: 'pending',
      type,
      created_at: BuildsService.getDateCreated(form),
      updated_at: BuildsService.getDateCreated(form),
      date: BuildsService.getIsoDate(form),
      user,
    };
  }

  public static buildUpdateRegister(
    register: Register,
    form: FormGroup
  ): Register {
    const { user } = register;
    return {
      ...register,
      value: form.value.value,
      created_at: BuildsService.getDateCreated(form),
      date: BuildsService.getIsoDate(form),
      description: form.value.description,
      category: form.value.category,
      _id: register._id,
    };
  }

  public static getDateCreated(form): number {
    return form.value.date
      ? new Date(BuildsService.formatDateAndHours(form)).getTime() / 1000
      : new Date().getTime() / 1000;
  }

  public static getIsoDate(form): Date {
    return form.value.date
      ? new Date(BuildsService.formatDateAndHours(form))
      : new Date();
  }

  private static formatDateAndHours(form) {
    return `${moment(form.value.date).format(
      'YYYY-MM-DD'
    )}:${new Date().getHours()}:${new Date().getMinutes()}`;
  }
}
