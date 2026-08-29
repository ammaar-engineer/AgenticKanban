import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { KanbanLayer } from './kanban-layer.entity.js';
import { KanbanAgent } from './kanban-agent.entity.js';

@Entity('kanban_boards')
export class KanbanBoard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => KanbanLayer, (layer) => layer.board)
  layers: KanbanLayer[];

  @OneToMany(() => KanbanAgent, (kanbanAgent) => kanbanAgent.board)
  kanbanAgents: KanbanAgent[];
}
