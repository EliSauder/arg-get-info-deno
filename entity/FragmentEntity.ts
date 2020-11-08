import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "https://denolib.com/denolib/typeorm@v0.2.23-rc9/mod.ts";
import { FragmentProperty } from "./FragmentPropertyEntity.ts";
import { FragmentFile } from "./FragmentFileEntity.ts";
import { IFragment } from "./interfaces/IFragment.ts";

@Entity()
export class Fragment implements IFragment {

    @PrimaryGeneratedColumn()
    id = 0;

    @Column({type:"varchar", length: 256, nullable: false, update: false})
    fragment = "";

    @Column({type: "integer", nullable: false, update: false})
    version = 0;

    @OneToMany(type => FragmentProperty, fragmentProperty => fragmentProperty.id)
    properties = undefined;

    @OneToOne(type => FragmentFile, fileFragment => fileFragment.fragment)
    fileInfo: undefined;

    @UpdateDateColumn()
    updated_at?:Date;

    @CreateDateColumn()
    created_at?:Date;
}