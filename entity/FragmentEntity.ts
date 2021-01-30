import { BeforeInsert, BeforeUpdate, Check, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "https://denolib.com/denolib/typeorm@v0.2.23-rc9/mod.ts";
import { FragmentProperty } from "./FragmentPropertyEntity.ts";
import { FragmentFile } from "./FragmentFileEntity.ts";
import { IFragment } from "./interfaces/IFragment.ts";

@Entity()
@Unique("fragment_version_layer", ["fragment", "version", "layer"])
export class Fragment implements IFragment {

    @PrimaryGeneratedColumn()
    id = 0;

    @Column({type:"varchar", length: 256, nullable: false, update: false})
    fragment = "";

    @Column({type: "integer", nullable: false, update: false})
    version = 0;

    @Column({type: "integer", nullable: false, update: false})
    layer = 0;

    @Column({type:"boolean", nullable: true, update: true, default: false})
    hasError = false;

    @Column({type:"varchar", nullable: true, update: true, default: null})
    error: string|null = null;
    
    @Column({type:"integer", nullable: true, update: true, default: 0})
    timesTried = 0;

    @UpdateDateColumn()
    updated_at?:Date;

    @CreateDateColumn()
    created_at?:Date;

    @OneToMany(type => FragmentProperty, fragmentProperty => fragmentProperty.id)
    properties?:FragmentProperty[] = undefined;

    @OneToOne(type => FragmentFile, fileFragment => fileFragment.fragment)
    fileInfo?: FragmentFile|null;
}