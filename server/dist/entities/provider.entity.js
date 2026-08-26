var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Agent } from "./agent.entity.js";
let Provider = class Provider {
    id;
    name;
    apiKey;
    url;
    agents;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Provider.prototype, "id", void 0);
__decorate([
    Column("text", { unique: true }),
    __metadata("design:type", String)
], Provider.prototype, "name", void 0);
__decorate([
    Column("text"),
    __metadata("design:type", String)
], Provider.prototype, "apiKey", void 0);
__decorate([
    Column("text"),
    __metadata("design:type", String)
], Provider.prototype, "url", void 0);
__decorate([
    OneToMany(() => Agent, (agent) => agent.provider, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Provider.prototype, "agents", void 0);
Provider = __decorate([
    Entity("providers")
], Provider);
export { Provider };
