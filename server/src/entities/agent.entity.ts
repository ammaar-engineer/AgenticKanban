import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Provider } from "./provider.entity.js";

@Entity("agents")
export class Agent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name!: string;

  @Column("text", { unique: true })
  model_id!: string;

  @Column("text", { nullable: true })
  personality?: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column("integer")
  provider_id!: number;

  @ManyToOne(() => Provider, (provider) => provider.agents, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "provider_id" })
  provider!: Provider;
}
