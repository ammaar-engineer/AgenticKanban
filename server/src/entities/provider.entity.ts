import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Agent } from "./agent.entity.js";

@Entity("providers")
export class Provider {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text", { unique: true })
  name!: string;

  @Column("text")
  apiKey!: string;

  @Column("text")
  url!: string;

  @OneToMany(() => Agent, (agent) => agent.provider, {
    cascade: true,
  })
  agents!: Agent[];
}
