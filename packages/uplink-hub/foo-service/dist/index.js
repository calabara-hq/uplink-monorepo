"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
const helloworld_pb_1 = require("./protos/helloworld_pb");
const helloworld_grpc_pb_1 = require("./protos/helloworld_grpc_pb");
const sayHello = (call, callback) => {
    const reply = new helloworld_pb_1.HelloReply();
    reply.setMessage(`Hello ${call.request.getName()}`);
    callback(null, reply);
};
var server = new grpc.Server();
server.addService(helloworld_grpc_pb_1.GreeterService, { sayHello });
server.bindAsync('0.0.0.0:3001', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});
//# sourceMappingURL=index.js.map