var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { KanbanLayer } from './kanban-layer.entity.js';
import { KanbanAgent } from './kanban-agent.entity.js';
let KanbanBoard = class KanbanBoard {
    id;
    name;
    description;
    layers;
    kanbanAgents;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], KanbanBoard.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], KanbanBoard.prototype, "name", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KanbanBoard.prototype, "description", void 0);
__decorate([
    OneToMany(() => KanbanLayer, (layer) => layer.board),
    __metadata("design:type", Array)
], KanbanBoard.prototype, "layers", void 0);
__decorate([
    OneToMany(() => KanbanAgent, (kanbanAgent) => kanbanAgent.board),
    __metadata("design:type", Array)
], KanbanBoard.prototype, "kanbanAgents", void 0);
KanbanBoard = __decorate([
    Entity('kanban_boards')
], KanbanBoard);
export { KanbanBoard };
