// @generated by protobuf-ts 2.8.2 with parameter generate_dependencies,long_type_string,server_grpc1
// @generated from protobuf file "authors_service.proto" (package "authors.v1", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { AuthorsService } from "./authors_service";
import type { ListAuthorsResponse } from "./authors_service";
import type { ListAuthorsRequest } from "./authors_service";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { Author } from "./authors_service";
import type { GetAuthorRequest } from "./authors_service";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service authors.v1.AuthorsService
 */
export interface IAuthorsServiceClient {
    /**
     * @generated from protobuf rpc: GetAuthor(authors.v1.GetAuthorRequest) returns (authors.v1.Author);
     */
    getAuthor(input: GetAuthorRequest, options?: RpcOptions): UnaryCall<GetAuthorRequest, Author>;
    /**
     * @generated from protobuf rpc: ListAuthors(authors.v1.ListAuthorsRequest) returns (authors.v1.ListAuthorsResponse);
     */
    listAuthors(input: ListAuthorsRequest, options?: RpcOptions): UnaryCall<ListAuthorsRequest, ListAuthorsResponse>;
}
/**
 * @generated from protobuf service authors.v1.AuthorsService
 */
export class AuthorsServiceClient implements IAuthorsServiceClient, ServiceInfo {
    typeName = AuthorsService.typeName;
    methods = AuthorsService.methods;
    options = AuthorsService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: GetAuthor(authors.v1.GetAuthorRequest) returns (authors.v1.Author);
     */
    getAuthor(input: GetAuthorRequest, options?: RpcOptions): UnaryCall<GetAuthorRequest, Author> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetAuthorRequest, Author>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: ListAuthors(authors.v1.ListAuthorsRequest) returns (authors.v1.ListAuthorsResponse);
     */
    listAuthors(input: ListAuthorsRequest, options?: RpcOptions): UnaryCall<ListAuthorsRequest, ListAuthorsResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<ListAuthorsRequest, ListAuthorsResponse>("unary", this._transport, method, opt, input);
    }
}
