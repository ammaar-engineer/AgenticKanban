var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { KanbanLayer } from './kanban-layer.entity.js';
import { Agent } from './agent.entity.js';
import { KanbanBoard } from './kanban-board.entity.js';
let KanbanAgent = class KanbanAgent {
    id;
    name;
    layersId;
    agentsId;
    boardId;
    layer;
    agent;
    board;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], KanbanAgent.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], KanbanAgent.prototype, "name", void 0);
__decorate([
    Column({ name: 'layers_id', type: 'uuid' }),
    __metadata("design:type", String)
], KanbanAgent.prototype, "layersId", void 0);
__decorate([
    Column({ name: 'agents_id', type: 'uuid' }),
    __metadata("design:type", String)
], KanbanAgent.prototype, "agentsId", void 0);
__decorate([
    Column({ name: 'board_id', type: 'uuid' }),
    __metadata("design:type", String)
], KanbanAgent.prototype, "boardId", void 0);
__decorate([
    ManyToOne(() => KanbanLayer, (layer) => layer.kanbanAgents, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'layers_id' }),
    __metadata("design:type", KanbanLayer)
], KanbanAgent.prototype, "layer", void 0);
__decorate([
    ManyToOne(() => Agent, (agent) => agent.kanbanAgents, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'agents_id' }),
    __metadata("design:type", Agent)
], KanbanAgent.prototype, "agent", void 0);
__decorate([
    ManyToOne(() => KanbanBoard, (board) => board.kanbanAgents, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'board_id' }),
    __metadata("design:type", KanbanBoard)
], KanbanAgent.prototype, "board", void 0);
KanbanAgent = __decorate([
    Entity('kanban_agents')
], KanbanAgent);
export { KanbanAgent };
