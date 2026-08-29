import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { KanbanLayer } from './kanban-layer.entity.js';
import { Agent } from './agent.entity.js';
import { KanbanBoard } from './kanban-board.entity.js';

@Entity('kanban_agents')
export class KanbanAgent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'layers_id', type: 'uuid' })
  layersId: string;

  @Column({ name: 'agents_id', type: 'uuid' })
  agentsId: string;

  @Column({ name: 'board_id', type: 'uuid' })
  boardId: string;

  @ManyToOne(() => KanbanLayer, (layer) => layer.kanbanAgents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'layers_id' })
  layer: KanbanLayer;

  @ManyToOne(() => Agent, (agent) => agent.kanbanAgents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agents_id' })
  agent: Agent;

  @ManyToOne(() => KanbanBoard, (board) => board.kanbanAgents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: KanbanBoard;
}
