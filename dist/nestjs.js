"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MessembedSDKModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectMessembedAdminSDK = exports.InjectMessembedSDK = exports.MessembedSDKModule = void 0;
const common_1 = require("@nestjs/common");
const _1 = require("./");
const MESSEMBED_SDK_MODULE__SDK_INSTANCE = Symbol('MESSEMBED_SDK_MODULE__SDK_INSTANCE');
const MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE = Symbol('MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE');
const MESSEMBED_SDK_MODULE__OPTIONS_PROVIDER = Symbol('MESSEMBED_SDK_MODULE__OPTIONS_PROVIDER');
const MESSEMBED_SDK_MODULE__ADMIN_OPTIONS_PROVIDER = Symbol('MESSEMBED_SDK_MODULE__ADMIN_OPTIONS_PROVIDER');
let MessembedSDKModule = MessembedSDKModule_1 = class MessembedSDKModule {
    static forRoot(options) {
        this.sdkInstance = new _1.MessembedSDK(options);
        return {
            module: MessembedSDKModule_1,
            providers: [
                {
                    provide: MESSEMBED_SDK_MODULE__SDK_INSTANCE,
                    useValue: this.sdkInstance,
                },
            ],
            exports: [MESSEMBED_SDK_MODULE__SDK_INSTANCE],
        };
    }
    static forRootAdmin(options) {
        this.adminSDKInstance = new _1.MessembedAdminSDK(options);
        return {
            module: MessembedSDKModule_1,
            providers: [
                {
                    provide: MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE,
                    useValue: this.adminSDKInstance,
                },
            ],
            exports: [MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE],
        };
    }
    static forRootAsync(asyncOptions) {
        return {
            module: MessembedSDKModule_1,
            providers: [
                {
                    provide: MESSEMBED_SDK_MODULE__OPTIONS_PROVIDER,
                    useFactory: asyncOptions.useFactory,
                    inject: asyncOptions.inject || [],
                },
                {
                    provide: MESSEMBED_SDK_MODULE__SDK_INSTANCE,
                    useFactory: (options) => {
                        this.sdkInstance = new _1.MessembedSDK(options);
                        return this.sdkInstance;
                    },
                    inject: [MESSEMBED_SDK_MODULE__OPTIONS_PROVIDER],
                },
            ],
            exports: [MESSEMBED_SDK_MODULE__SDK_INSTANCE],
        };
    }
    static forRootAdminAsync(asyncOptions) {
        return {
            module: MessembedSDKModule_1,
            providers: [
                {
                    provide: MESSEMBED_SDK_MODULE__ADMIN_OPTIONS_PROVIDER,
                    useFactory: asyncOptions.useFactory,
                    inject: asyncOptions.inject || [],
                },
                {
                    provide: MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE,
                    useFactory: (options) => {
                        this.adminSDKInstance = new _1.MessembedAdminSDK(options);
                        return this.adminSDKInstance;
                    },
                    inject: [MESSEMBED_SDK_MODULE__ADMIN_OPTIONS_PROVIDER],
                },
            ],
            exports: [MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE],
        };
    }
};
MessembedSDKModule = MessembedSDKModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({})
], MessembedSDKModule);
exports.MessembedSDKModule = MessembedSDKModule;
function InjectMessembedSDK() {
    return common_1.Inject(MESSEMBED_SDK_MODULE__SDK_INSTANCE);
}
exports.InjectMessembedSDK = InjectMessembedSDK;
function InjectMessembedAdminSDK() {
    return common_1.Inject(MESSEMBED_SDK_MODULE__ADMIN_SDK_INSTANCE);
}
exports.InjectMessembedAdminSDK = InjectMessembedAdminSDK;
//# sourceMappingURL=nestjs.js.map