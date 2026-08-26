var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Provider } from "./provider.entity.js";
let Agent = class Agent {
    id;
    name;
    model_id;
    personality;
    description;
    provider_id;
    provider;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Agent.prototype, "id", void 0);
__decorate([
    Column("text"),
    __metadata("design:type", String)
], Agent.prototype, "name", void 0);
__decorate([
    Column("text", { unique: true }),
    __metadata("design:type", String)
], Agent.prototype, "model_id", void 0);
__decorate([
    Column("text", { nullable: true }),
    __metadata("design:type", String)
], Agent.prototype, "personality", void 0);
__decorate([
    Column("text", { nullable: true }),
    __metadata("design:type", String)
], Agent.prototype, "description", void 0);
__decorate([
    Column("integer"),
    __metadata("design:type", Number)
], Agent.prototype, "provider_id", void 0);
__decorate([
    ManyToOne(() => Provider, (provider) => provider.agents, {
        onDelete: "CASCADE",
    }),
    JoinColumn({ name: "provider_id" }),
    __metadata("design:type", Provider)
], Agent.prototype, "provider", void 0);
Agent = __decorate([
    Entity("agents")
], Agent);
export { Agent };
