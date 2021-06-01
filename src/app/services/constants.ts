import { environment } from '../../environments/environment';

export class Constants {
  public readonly paths: any = {
    fetchIsOnline: '',
    fetchConsolidado: 'dashboard/calc_consolidado',
    fetchRegisters: 'dashboard/fetch_registers',
    fetchRegistersToDashboard: 'dashboard/fetch_registers_to_dashboard',
    fetchEvolucao: 'dashboard/fetch_evolucao',
    fetchEvolucaoDespesas: 'dashboard/fetch_evolucao_despesas',
    fetchEvolucaoDetail: 'dashboard/fetch_evolucao_detail',
    fetchSearch: 'dashboard/search',
    fetchExcel: 'dashboard/excel',
    fetchGraphCategory: 'dashboard/fetch_graph_category',
    fetchGraphOutcomeIncome: 'dashboard/fetch_graph_outcome_income',
    fetchLastdate: 'dashboard/fetch_lastdate_outcome',
    fetchAllLastRegisters: 'dashboard/fetch_all_last_registers',
    newRegister: 'dashboard/new_register',
    deleteRegister: 'dashboard/delete_register',
    updateRegister: 'dashboard/update_register',
    updateUser: 'dashboard/update_user',
    getStatusCode: 'dashboard/get_status_code',
    getListAutocomplete: 'dashboard/get_list_autocomplete',
    setDeMmode: 'dashboard/set_dev_mode',

    signup: 'login/signup',
    signin: 'login/signin',
    resetPassword: 'login/reset_password',
    loginVerified: 'login/login_verified',
    emailToReset: 'login/email_to_reset',
    emailToVerified: 'login/email_to_verified',

    profileUpdate: 'profile/update',
    profileGet: 'profile/get_profile',
    profileDelete: 'profile/delete',

    fileImages: 'files/images?name=',
    fileDownloadList: 'files/download_list',
    fileDownload: 'files/download',
  };

  private readonly host: string;

  constructor() {
    if (environment.production) {
      console.log('prod server');
      this.host = 'https://api-organizese.herokuapp.com/';
    } else {
      console.log('local server');
      this.host = 'http://192.168.0.123:5000/';
    }
  }

  public get(key: string, host?: string): string {
    host = host ? host : this.host;
    const path = host + this.paths[key];
    if (path === undefined) {
      throw new Error('Couldnt find ' + key + ' in paths');
    }
    return path;
  }
}
