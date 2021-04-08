import { DynamicModule } from '@nestjs/common';
import { MessembedAdminSDKParams, MessembedSDKParams } from './interfaces';
export declare class MessembedSDKModule {
    private static sdkInstance?;
    private static adminSDKInstance?;
    static forRoot(options: MessembedSDKParams): DynamicModule;
    static forRootAdmin(options: MessembedAdminSDKParams): DynamicModule;
    static forRootAsync(asyncOptions: {
        useFactory: (...args: any[]) => MessembedSDKParams | Promise<MessembedSDKParams>;
        imports?: any[];
        inject?: any[];
    }): DynamicModule;
    static forRootAdminAsync(asyncOptions: {
        useFactory: (...args: any[]) => MessembedAdminSDKParams | Promise<MessembedAdminSDKParams>;
        imports?: any[];
        inject?: any[];
    }): DynamicModule;
}
export declare function InjectMessembedSDK(): ParameterDecorator;
export declare function InjectMessembedAdminSDK(): ParameterDecorator;
