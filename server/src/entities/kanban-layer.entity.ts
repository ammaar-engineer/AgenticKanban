import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { KanbanBoard } from './kanban-board.entity.js';
import { KanbanAgent } from './kanban-agent.entity.js';

@Entity('kanban_layers')
export class KanbanLayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'board_id', type: 'uuid' })
  boardId: string;

  @ManyToOne(() => KanbanBoard, (board) => board.layers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: KanbanBoard;

  @OneToMany(() => KanbanAgent, (kanbanAgent) => kanbanAgent.layer)
  kanbanAgents: KanbanAgent[];
}
