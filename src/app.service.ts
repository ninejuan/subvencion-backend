import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getKeyword() {
    return process.env.CB_URL;
  }

  async getNew() {

  }
}
