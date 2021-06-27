export class UtilsService {
  public static getTimeDefault(time?): number {
    return time ? time : 1000;
  }
}
