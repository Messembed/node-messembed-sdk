import { DynamicModule, Global, Inject, Module } from '@nestjs/common';
import { MessembedSDK } from './messembed-sdk';

const MESSEMBED_SDK_MODULE__SDK_INSTANCE = Symbol(
  'MESSEMBED_SDK_MODULE__SDK_INSTANCE',
);
const MESSEMBED_SDK_MODULE__URL_PROVIDER = Symbol(
  'MESSEMBED_SDK_MODULE__URL_PROVIDER',
);

@Global()
@Module({})
export class MessembedSDKModule {
  private static sdkInstance?: MessembedSDK;

  static forRoot(messembedUrl: string): DynamicModule {
    this.sdkInstance = new MessembedSDK(messembedUrl);

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

  static forRootAsync(asyncOptions: {
    useFactory: (...args: any[]) => string | Promise<string>;
    imports?: any[];
    inject?: any[];
  }): DynamicModule {
    return {
      module: MessembedSDKModule,
      providers: [
        {
          provide: MESSEMBED_SDK_MODULE__URL_PROVIDER,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject || [],
        },
        {
          provide: MESSEMBED_SDK_MODULE__SDK_INSTANCE,
          useFactory: (messembedUrl: string): MessembedSDK => {
            this.sdkInstance = new MessembedSDK(messembedUrl);

            return this.sdkInstance;
          },
          inject: [MESSEMBED_SDK_MODULE__URL_PROVIDER],
        },
      ],
      exports: [MESSEMBED_SDK_MODULE__SDK_INSTANCE],
    };
  }
}

export function InjectMessembedSDK(): ParameterDecorator {
  return Inject(MESSEMBED_SDK_MODULE__SDK_INSTANCE);
}
