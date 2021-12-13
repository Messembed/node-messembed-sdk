import { DynamicModule, Global, Inject, Module } from '@nestjs/common';
import { MessembedSDK, MessembedAdminSDK } from './';
import { MessembedAdminSDKParams, MessembedSDKParams } from './interfaces';

const MESSEMBED_SDK_MODULE__SDK_INSTANCE = Symbol('MESSEMBED_SDK_MODULE__SDK_INSTANCE');
const MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE = Symbol('MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE');
const MESSEMBED_SDK_MODULE__OPTIONS_PROVIDER = Symbol('MESSEMBED_SDK_MODULE__OPTIONS_PROVIDER');
const MESSEMBED_SDK_MODULE__ADMIN_OPTIONS_PROVIDER = Symbol('MESSEMBED_SDK_MODULE__ADMIN_OPTIONS_PROVIDER');

@Global()
@Module({})
export class MessembedSDKModule {
  private static sdkInstance?: MessembedSDK;
  private static adminSDKInstance?: MessembedAdminSDK;

  static forRoot(options: MessembedSDKParams): DynamicModule {
    this.sdkInstance = new MessembedSDK(options);

    return {
      module: MessembedSDKModule,
      providers: [
        {
          provide: MESSEMBED_SDK_MODULE__SDK_INSTANCE,
          useValue: this.sdkInstance,
        },
      ],
      exports: [MESSEMBED_SDK_MODULE__SDK_INSTANCE],
    };
  }

  static forRootAdmin(options: MessembedAdminSDKParams): DynamicModule {
    this.adminSDKInstance = new MessembedAdminSDK(options);

    return {
      module: MessembedSDKModule,
      providers: [
        {
          provide: MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE,
          useValue: this.adminSDKInstance,
        },
      ],
      exports: [MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE],
    };
  }

  static forRootAsync(asyncOptions: {
    useFactory: (...args: any[]) => MessembedSDKParams | Promise<MessembedSDKParams>;
    imports?: any[];
    inject?: any[];
  }): DynamicModule {
    return {
      module: MessembedSDKModule,
      providers: [
        {
          provide: MESSEMBED_SDK_MODULE__OPTIONS_PROVIDER,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject || [],
        },
        {
          provide: MESSEMBED_SDK_MODULE__SDK_INSTANCE,
          useFactory: (options: MessembedSDKParams): MessembedSDK => {
            this.sdkInstance = new MessembedSDK(options);

            return this.sdkInstance;
          },
          inject: [MESSEMBED_SDK_MODULE__OPTIONS_PROVIDER],
        },
      ],
      exports: [MESSEMBED_SDK_MODULE__SDK_INSTANCE],
    };
  }

  static forRootAdminAsync(asyncOptions: {
    useFactory: (...args: any[]) => MessembedAdminSDKParams | Promise<MessembedAdminSDKParams>;
    imports?: any[];
    inject?: any[];
  }): DynamicModule {
    return {
      module: MessembedSDKModule,
      providers: [
        {
          provide: MESSEMBED_SDK_MODULE__ADMIN_OPTIONS_PROVIDER,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject || [],
        },
        {
          provide: MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE,
          useFactory: (options: MessembedAdminSDKParams): MessembedAdminSDK => {
            this.adminSDKInstance = new MessembedAdminSDK(options);

            return this.adminSDKInstance;
          },
          inject: [MESSEMBED_SDK_MODULE__ADMIN_OPTIONS_PROVIDER],
        },
      ],
      exports: [MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE],
    };
  }
}

export function InjectMessembedSDK(): ParameterDecorator {
  return Inject(MESSEMBED_SDK_MODULE__SDK_INSTANCE);
}

export function InjectMessembedAdminSDK(): ParameterDecorator {
  return Inject(MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE);
}
