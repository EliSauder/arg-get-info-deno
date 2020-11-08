import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "https://denolib.com/denolib/typeorm@v0.2.23-rc9/mod.ts";
import { IFragmentProperty } from "./interfaces/IFragmentProperty.ts";
import { Fragment } from "./FragmentEntity.ts";

@Entity()
export class FragmentProperty implements IFragmentProperty {

    @PrimaryGeneratedColumn()
    id = 0;

    @ManyToOne(type => Fragment, fragment => fragment.properties)
    fragment = undefined;

    @Column({type:"varchar", length:128, nullable: false})
    name = "";
    
    @Column({type:"text", nullable: true})
    value = undefined;

    @UpdateDateColumn()
    updated_at?:Date;

    @CreateDateColumn()
    created_at?:Date;
}