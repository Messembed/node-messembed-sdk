import { DynamicModule } from '@nestjs/common';
import { MessembedAdminSDKOptions, MessembedSDKOptions } from './interfaces';
export declare class MessembedSDKModule {
    private static sdkInstance?;
    private static adminSDKInstance?;
    static forRoot(options: MessembedSDKOptions): DynamicModule;
    static forRootAdmin(options: MessembedAdminSDKOptions): DynamicModule;
    static forRootAsync(asyncOptions: {
        useFactory: (...args: any[]) => MessembedSDKOptions | Promise<MessembedSDKOptions>;
        imports?: any[];
        inject?: any[];
    }): DynamicModule;
    static forRootAdminAsync(asyncOptions: {
        useFactory: (...args: any[]) => MessembedAdminSDKOptions | Promise<MessembedAdminSDKOptions>;
        imports?: any[];
        inject?: any[];
    }): DynamicModule;
}
export declare function InjectMessembedSDK(): ParameterDecorator;
export declare function InjectMessembedAdminSDK(): ParameterDecorator;
