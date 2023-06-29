import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy from 'passport-headerapikey';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({ header: 'X-API-KEY', prefix: '' },
        true,
        async (apiKey: string, done: (error: Error, data: any) => {}) => {
            return this.validate(apiKey, done);
        });
    }

    validate = (apiKey: string, done: (error: Error|null, data: any) => {}) => {
        if (this.configService.get<string>('API_KEY') === apiKey) {
            done(null, true);
        }
        done(new UnauthorizedException(), null);
    }
}